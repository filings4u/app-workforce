import {supabase} from './supabase.js?v=20260916-auth-isolation-v4';
const role=location.pathname.includes('/ctpa/')?'ctpa':'employer';
const status=document.querySelector('#dotStatus'),container=document.querySelector('#dotModules');
(async()=>{try{
 const {data:{session}}=await supabase.auth.getSession();if(!session)throw Error('Sign in to continue.');
 const {data:ctx,error:e1}=await supabase.functions.invoke('workforce-session-context',{body:{requested_portal:role}});
 if(e1||!ctx?.has_access||ctx.requires_workspace_selection)throw Error('Workspace access unavailable.');
 const org=ctx.membership?.organization_id||ctx.organization?.id||ctx.organization_id;
 if(!/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(String(org||'')))throw Error('Organization not verified.');
 const {data:p,error:e2}=await supabase.functions.invoke('workforce-access-policy',{body:{organization_id:org}});
 if(e2||!p?.access_granted||!p.effective_programs?.includes('DOT'))throw Error('DOT access denied.');
 const agencies=['FMCSA','FAA','FRA','FTA','PHMSA','USCG'];
 const allowed=role==='ctpa'?agencies:agencies.filter(a=>p.subscriptions?.some(s=>s.agency===a));
 if(!allowed.length)throw Error('DOT agency assignment is required.');
 const list=document.querySelector('#dotAgencyList');for(const agency of allowed){const el=document.createElement('div');el.className='card';el.style.padding='18px';el.style.margin='12px 0';el.textContent=agency+' — Legacy workflow migration pending';list.append(el)}
 status.textContent='DOT access verified';container.hidden=false;
 }catch(e){status.textContent=e?.message||'Access denied';status.setAttribute('role','alert')}})();