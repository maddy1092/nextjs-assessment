import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { id } = query;

  switch (method) {
    case 'GET':
      const { data, error } = await supabase
        .from('company')
        .select('*')
        .eq('id', id as string);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    case 'PUT':
      const { name, industry_id } = body;
      const { data: updateData, error: updateError } = await supabase
        .from('company')
        .update({ name, industry_id })
        .eq('id', id as string);
      if (updateError) return res.status(400).json({ error: updateError.message });
      return res.status(200).json(updateData);
    case 'DELETE':
      const { error: deleteError } = await supabase
        .from('company')
        .delete()
        .eq('id', id as string);
      if (deleteError) return res.status(400).json({ error: deleteError.message });
      return res.status(204).end();
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
