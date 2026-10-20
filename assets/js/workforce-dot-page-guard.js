import {supabase} from './supabase.js?v=20260916-auth-isolation-v4';
const role=location.pathname.includes('/ctpa/')?'ctpa':'employer';
const redirect=()=>location.replace('../access-required.html?reason=dot-program');
(async()=>{
 try{
  const {data:{session},error:authError}=await supabase.auth.getSession();
  if(authError||!session){location.replace('../'+role+'-login.html?next='+encodeURIComponent(location.pathname));return}
  const {data:ctx,error:contextError}=await supabase.functions.invoke('workforce-session-context',{body:{requested_portal:role}});
  if(contextError||!ctx?.has_access||ctx?.requires_workspace_selection||ctx?.portal!==role)return redirect();
  const org=ctx.membership?.organization_id||ctx.organization?.id||ctx.organization_id;
  if(!/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(String(org||'')))return redirect();
  const {data:policy,error:policyError}=await supabase.functions.invoke('workforce-access-policy',{body:{organization_id:org}});
  if(policyError||!policy?.access_granted||!policy.effective_programs?.includes('DOT'))return redirect();
  document.body.style.visibility='';
 }catch{redirect()}
})();