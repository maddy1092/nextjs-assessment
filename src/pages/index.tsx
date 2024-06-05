import { useEffect, useState } from 'react';
import { Session } from "@supabase/auth-js/src/lib/types"
import { supabase } from '@/utils/supabaseClient';
import CompanyManager from '@/components/CompanyManager';
import IndustryManager from '@/components/IndustryManager';
import { useRouter } from 'next/router';

const Home = () => {
  const [session, setSession] = useState<Session|null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let retry_attempt = 0;
    const fetchSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!session && error) {
            console.log("Error: Session has been expired");
            router.push('/auth/login');
        }
        setSession(session);
        setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log(_event)
        setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/auth/login'); // Redirect to login page if not authenticated
    }
  }, [loading, session, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to Your Next.js Application</h1>
      <p>Hello, {session?.user.email}</p>
      <CompanyManager />
      <IndustryManager />
    </div>
  );
};

export default Home;
