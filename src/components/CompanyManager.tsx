import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Tables } from '../../database.types';

let company: Tables<'company'>
let industry: Tables<'industry'>

const CompanyManager = () => {
  const [companies, setCompanies] = useState<Tables<'company'>[]>([]);
  const [name, setName] = useState<string>('');
  const [industryId, setIndustryId] = useState<string>('');
  const [industries, setIndustries] = useState<Tables<'industry'>[]>([]);

  useEffect(() => {
    fetchCompanies();
    fetchIndustries();
  }, []);

  const fetchCompanies = async () => {
    const { data, error } = await supabase.from('company').select('*');
    if (error) console.error(error);
    else setCompanies(data);
  };

  const fetchIndustries = async () => {
    const { data, error } = await supabase.from('industry').select('*');
    if (error) console.error(error);
    else setIndustries(data);
  };

  const handleAddCompany = async () => {
    const { error } = await supabase.from('company').insert([{ name, industry_id: industryId }]);
    if (error) console.error(error);
    else {
      setName('');
      setIndustryId('');
      fetchCompanies();
    }
  };

  const handleDeleteCompany = async (id: string) => {
    const { error } = await supabase.from('company').delete().eq('id', id);
    if (error) console.error(error);
    else fetchCompanies();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Company Manager</h2>
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Company Name"
          className="border p-2 mr-2"
        />
        <select
          value={industryId}
          onChange={(e) => setIndustryId(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select Industry</option>
          {industries.map((industry) => (
            <option key={industry.id} value={industry.id}>
              {industry.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddCompany} className="bg-blue-500 text-white p-2 rounded">
          Add Company
        </button>
      </div>
      <ul>
        {companies.map((company) => (
          <li key={company.id} className="mb-2">
            {company.name} ({company.industry_id})
            <button
              onClick={() => handleDeleteCompany(company.id)}
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

export default CompanyManager;
