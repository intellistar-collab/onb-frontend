// Debug utility for authentication issues
export const debugAuth = () => {
  if (typeof window === 'undefined') return;
  
  console.log('=== AUTH DEBUG INFO ===');
  console.log('Server URL:', process.env.NEXT_PUBLIC_SERVER_URL);
  console.log('Current URL:', window.location.href);
  console.log('Cookies:', document.cookie);
  console.log('Local Storage Token:', localStorage.getItem('better-auth.session_token'));
  console.log('Local Storage User:', localStorage.getItem('user'));
  console.log('========================');
};

// Call this function in browser console to debug auth issues
(window as any).debugAuth = debugAuth;
