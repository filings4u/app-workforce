import {supabase} from './supabase.js?v=20260916-auth-isolation-v4';
const deny=(message)=>{document.body.classList.remove('s4u-dot-pending');document.querySelector('.portal-shell')?.remove();const main=document.createElement('main');main.style.cssText='max-width:640px;margin:12vh auto;padding:32px;font-family:Arial,sans-serif';const h=document.createElement('h1');h.textContent='DOT access unavailable';const p=document.createElement('p');p.textContent=message;const a=document.createElement('a');a.href='../workspace-select.html';a.textContent='Select another workspace';main.append(h,p,a);document.body.append(main)};
try{
 const {data:{session}}=await supabase.auth.getSession();
 if(!session)deny('Sign in to an authorized account.');
 else{
 const {data:ctx,error:e}=await supabase.functions.invoke('workforce-session-context',{body:{requested_portal:'ctpa'}});
 if(e||!ctx?.has_access||ctx.requires_workspace_selection||ctx.portal!=='ctpa')deny('Select an active C/TPA workspace.');
 else{
 const org=ctx.membership?.organization_id||ctx.organization?.id||ctx.organization_id;
 if(!/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(String(org||'')))deny('Organization could not be verified.');
 else{
 const {data:policy,error:pe}=await supabase.functions.invoke('workforce-access-policy',{body:{organization_id:org}});
 if(pe||!policy?.access_granted||!policy.effective_programs?.includes('DOT'))deny('Your subscription does not include DOT access.');
 else document.body.classList.remove('s4u-dot-pending');
 }
 }
 }
}catch(e){deny('Authorization could not be verified.')}
