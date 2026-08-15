CREATE POLICY "own folder read photos" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id IN ('meal-photos','progress-photos') AND public.can_view_client(((storage.foldername(name))[1])::uuid));

CREATE POLICY "own folder insert photos" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('meal-photos','progress-photos') AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "own folder update photos" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('meal-photos','progress-photos') AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "own folder delete photos" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('meal-photos','progress-photos') AND auth.uid()::text = (storage.foldername(name))[1]);