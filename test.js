const supabase = require('./supabase');

(async () => {
  const { error } = await supabase.auth.getSession();
  console.log(error ? 'Failed: ' + error.message : 'Connected to Supabase');
})();
