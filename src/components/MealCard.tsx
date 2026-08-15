import { Camera, Clock, MessageSquare, Utensils } from "lucide-react";

export function MealCard({ log }: { log: any }) {
  return (
    <article className="surface flex flex-col overflow-hidden animate-rise">
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
            <Utensils className="size-4" />
          </span>
          <div>
            <h4 className="font-display text-base leading-tight">{log.meal_name}</h4>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="size-3" />
              {log.logged_time}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        <div className="aspect-square w-full shrink-0 overflow-hidden rounded-xl sm:w-28 sm:rounded-2xl"
             style={{ backgroundColor: `hsl(${'photo_hue' in log ? log.photo_hue : 40}, 80%, 95%)` }}>
          <div className="flex h-full w-full items-center justify-center text-black/10">
            <Camera className="size-8" />
          </div>
        </div>
        
        <div className="min-w-0 flex-1 space-y-3">
          {log.description ? (
            <p className="text-sm leading-relaxed">{log.description}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">Sem descrição</p>
          )}
          
          <div className="flex flex-wrap gap-2">
            {log.difficulties?.filter((d: string) => d !== 'Sem dificuldade').map((diff: string) => (
              <span key={diff} className="rounded-md bg-warm/10 px-2 py-1 text-[10px] font-medium text-warm-foreground">
                {diff}
              </span>
            ))}
          </div>
          
          {(log.hunger_before || log.fullness_after) && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {log.hunger_before && (
                <span>Fome: {log.hunger_before}/5</span>
              )}
              {log.fullness_after && (
                <span>Saciedade: {log.fullness_after}/5</span>
              )}
            </div>
          )}
        </div>
      </div>

      {log.comment && (
        <div className="mt-auto border-t border-border/50 bg-muted/10 px-4 py-3">
          <p className="flex items-start gap-2 text-xs italic text-muted-foreground">
            <MessageSquare className="mt-0.5 size-3 shrink-0" />
            {log.comment}
          </p>
        </div>
      )}
    </article>
  );
}
