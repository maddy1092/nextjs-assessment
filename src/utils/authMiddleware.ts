import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { supabase } from '@/utils/supabaseClient';

type User = {
    id: string,
    email?: string | undefined,
    phone?: string | undefined,
    role?: string | undefined
};

interface AuthenticatedNextApiRequest extends NextApiRequest {
    user?: User
}
  

export function authMiddleware(handler: NextApiHandler): NextApiHandler {
  return async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user;
    return handler(req, res);
  };
}
