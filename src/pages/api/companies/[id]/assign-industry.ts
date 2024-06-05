import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { id } = query;
  const { industry_id } = body;

  if (method === 'POST') {
    const { data, error } = await supabase
      .from('company')
      .update({ industry_id })
      .eq('id', id as string);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
