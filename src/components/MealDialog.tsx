import { useMutation } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useInvalidate } from "@/lib/data";
import {
  DIFFICULTY_OPTIONS,
  FULLNESS_LABELS,
  HUNGER_LABELS,
  nowTime,
  todayISO,
} from "@/lib/rotina";

export type MealDialogTarget = {
  scheduleId?: string | null;
  name: string;
  time: string;
};

function ScaleField({
  label,
  value,
  onChange,
  labels,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  labels: string[];
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            aria-pressed={value === level}
            className={`h-11 flex-1 rounded-xl border text-sm font-medium transition-colors ${
              value === level
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {level}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {value ? labels[value - 1] : "Toque para escolher"}
      </p>
    </div>
  );
}

export function MealDialog({
  open,
  onOpenChange,
  target,
  userId,
  date = todayISO(),
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: MealDialogTarget | null;
  userId: string;
  date?: string;
}) {
  const invalidate = useInvalidate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [time, setTime] = useState(nowTime());
  const [description, setDescription] = useState("");
  const [portion, setPortion] = useState("");
  const [hunger, setHunger] = useState<number | null>(null);
  const [fullness, setFullness] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [difficultyNote, setDifficultyNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(target?.name ?? "Refeição");
    setTime(target?.time ?? nowTime());
    setDescription("");
    setPortion("");
    setHunger(null);
    setFullness(null);
    setComment("");
    setDifficulties([]);
    setDifficultyNote("");
    setFile(null);
    setPreview(null);
  }, [open, target]);

  const save = useMutation({
    mutationFn: async () => {
      if (!description.trim()) throw new Error("Conte o que você comeu para salvar o registro.");
      const { data, error } = await supabase
        .from("meal_logs")
        .insert({
          user_id: userId,
          schedule_id: target?.scheduleId ?? null,
          log_date: date,
          logged_time: time,
          meal_name: name.trim() || "Refeição",
          description: description.trim().slice(0, 1000),
          portion: portion.trim() ? portion.trim().slice(0, 120) : null,
          hunger_before: hunger,
          fullness_after: fullness,
          comment: comment.trim() ? comment.trim().slice(0, 1000) : null,
          difficulties,
          difficulty_note: difficultyNote.trim() ? difficultyNote.trim().slice(0, 500) : null,
        })
        .select("id")
        .single();
      if (error) throw error;

      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${userId}/${data.id}.${ext}`;
        const upload = await supabase.storage.from("meal-photos").upload(path, file, { upsert: true });
        if (upload.error) throw upload.error;
        const { error: photoError } = await supabase
          .from("meal_photos")
          .insert({ user_id: userId, meal_log_id: data.id, storage_path: path });
        if (photoError) throw photoError;
      }
    },
    onSuccess: () => {
      invalidate(["meal_logs"]);
      toast.success("Refeição registrada. Cada registro ajuda você a entender melhor seus hábitos.");
      onOpenChange(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggleDifficulty = (option: string) => {
    setDifficulties((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>Registrar refeição</DialogTitle>
          <DialogDescription>
            Leva poucos segundos. Registre do jeito que foi — sem cobrança, sem perfeição.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-40 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-border bg-muted text-sm text-muted-foreground transition-colors hover:bg-secondary"
          >
            {preview ? (
              <img src={preview} alt="Pré-visualização da refeição" className="size-full object-cover" />
            ) : (
              <>
                <Camera className="size-6" aria-hidden />
                Adicionar foto da refeição (opcional)
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0] ?? null;
              setFile(selected);
              setPreview(selected ? URL.createObjectURL(selected) : null);
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="meal-time">Horário</Label>
              <Input
                id="meal-time"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meal-name">Refeição</Label>
              <Input
                id="meal-name"
                value={name}
                maxLength={60}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-desc">O que você comeu?</Label>
            <Textarea
              id="meal-desc"
              rows={3}
              maxLength={1000}
              placeholder="Ex.: arroz, feijão, frango grelhado e salada"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-portion">Quantidade aproximada (opcional)</Label>
            <Input
              id="meal-portion"
              maxLength={120}
              placeholder="Ex.: 1 prato, 2 colheres"
              value={portion}
              onChange={(event) => setPortion(event.target.value)}
            />
          </div>

          <ScaleField
            label="Fome antes da refeição"
            value={hunger}
            onChange={setHunger}
            labels={HUNGER_LABELS}
          />
          <ScaleField
            label="Saciedade depois"
            value={fullness}
            onChange={setFullness}
            labels={FULLNESS_LABELS}
          />

          <div className="space-y-2">
            <Label htmlFor="meal-comment">Como foi essa refeição?</Label>
            <Textarea
              id="meal-comment"
              rows={2}
              maxLength={1000}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Teve alguma dificuldade?</Label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((option) => {
                const active = difficulties.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleDifficulty(option)}
                    aria-pressed={active}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      active
                        ? "border-warm bg-warm text-warm-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-diff-note">Quer comentar algo sobre a dificuldade?</Label>
            <Textarea
              id="meal-diff-note"
              rows={2}
              maxLength={500}
              value={difficultyNote}
              onChange={(event) => setDifficultyNote(event.target.value)}
            />
          </div>

          <Button
            className="h-12 w-full text-base"
            disabled={save.isPending}
            onClick={() => save.mutate()}
          >
            {save.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Salvar refeição
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
