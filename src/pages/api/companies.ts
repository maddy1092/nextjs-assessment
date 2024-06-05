import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  switch (method) {
    case 'POST':
      const { name, industry_id } = body;
      const { data, error } = await supabase
        .from('company')
        .insert([{ name, industry_id }]);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json(data);
    case 'GET':
      const { data: companies, error: getError } = await supabase
        .from('company')
        .select('*');
      if (getError) return res.status(400).json({ error: getError.message });
      return res.status(200).json(companies);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
