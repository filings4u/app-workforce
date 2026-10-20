import {supabase} from './supabase.js?v=20260916-auth-isolation-v4';
const role=location.pathname.includes('/ctpa/')?'ctpa':'employer';
const orgPattern=/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
async function run(){
 try{
  const {data:{session}}=await supabase.auth.getSession();if(!session)return;
  const {data:ctx,error:ce}=await supabase.functions.invoke('workforce-session-context',{body:{requested_portal:role}});
  if(ce||!ctx?.has_access||ctx.requires_workspace_selection)return;
  const org=ctx.membership?.organization_id||ctx.organization?.id||ctx.organization_id;
  if(!orgPattern.test(String(org||'')))return;
  const {data:policy,error}=await supabase.functions.invoke('workforce-access-policy',{body:{organization_id:org}});
  if(error||!policy?.access_granted||!policy.effective_programs?.includes('DOT'))return;
  const sidebar=document.querySelector('.sidebar-nav, #employerSidebar nav, aside.sidebar nav');
  if(!sidebar||sidebar.querySelector('[data-workforce-dot-link]'))return;
  const a=document.createElement('a');a.href='dot-programs.html';a.className='nav-link';a.dataset.workforceDotLink='1';a.textContent='DOT Compliance';
  sidebar.append(a);
 }catch(e){console.warn('DOT module access unavailable',e)}
}
run();
