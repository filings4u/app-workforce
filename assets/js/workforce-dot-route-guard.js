import {supabase} from './supabase.js?v=20260916-auth-isolation-v4';
const role=location.pathname.includes('/ctpa/')?'ctpa':'employer';
const root=new URL('../../',import.meta.url);
async function check(){
 let granted=false;
 try{
  const {data:{session}}=await supabase.auth.getSession();
  if(!session)throw Error('Authentication required');
  const {data:ctx,error:ce}=await supabase.functions.invoke('workforce-session-context',{body:{requested_portal:role}});
  if(ce||!ctx?.has_access||ctx.requires_workspace_selection||ctx.portal!==role)throw Error('Workspace access denied');
  const org=ctx.membership?.organization_id||ctx.organization?.id||ctx.organization_id;
  if(!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(String(org||'')))throw Error('Workspace organization not established');
  const {data:policy,error:pe}=await supabase.functions.invoke('workforce-access-policy',{body:{organization_id:org}});
  if(pe||!policy?.access_granted||!policy.effective_programs?.includes('DOT'))throw Error('DOT subscription required');
  granted=true;
 }catch(e){console.warn('DOT route denied',e)}
 if(granted){document.querySelector('#workforce-dot-lock')?.remove();return}
 location.replace(new URL('access-required.html?reason=dot-entitlement',root));
}
check();
