const envUrl = import.meta.env.VITE_API_URL;
console.log('VITE_API_URL from env:', envUrl);
export const apiLink = (envUrl || 'https://industryguru-backend.hcx5k4.easypanel.host/api').replace('/api', '');
console.log('Final apiLink:', apiLink);

