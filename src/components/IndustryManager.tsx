import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Tables } from '../../database.types';

let industry: Tables<'industry'>

const IndustryManager = () => {
  const [industries, setIndustries] = useState<Tables<'industry'>[]>([]);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    const { data, error } = await supabase.from('industry').select('*');
    if (error) console.error(error);
    else setIndustries(data || []);
  };

  const handleAddIndustry = async () => {
    const { error } = await supabase.from('industry').insert([{ name }]);
    if (error) console.error(error);
    else {
      setName('');
      fetchIndustries();
    }
  };

  const handleDeleteIndustry = async (id: string) => {
    const { error } = await supabase.from('industry').delete().eq('id', id);
    if (error) console.error(error);
    else fetchIndustries();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Industry Manager</h2>
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Industry Name"
          className="border p-2 mr-2"
        />
        <button onClick={handleAddIndustry} className="bg-blue-500 text-white p-2 rounded">
          Add Industry
        </button>
      </div>
      <ul>
        {industries.map((industry) => (
          <li key={industry.id} className="mb-2">
            {industry.name}
            <button
              onClick={() => handleDeleteIndustry(industry.id)}
              className="bg-red-500 text-white p-2 ml-4 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndustryManager;
