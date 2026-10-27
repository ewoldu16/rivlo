import type {ReactNode} from 'react';
export function LoadingSkeleton({label='Loading content…',rows=3}:{label?:string;rows?:number}){return <div className="ui-skeleton" role="status"><span className="ui-loading-label">{label}</span>{Array.from({length:rows},(_,i)=><span className="ui-skeleton-row" key={i} aria-hidden="true"><i/><span><b/><b/></span></span>)}</div>}
export function ContentPanel({children,className=''}:{children:ReactNode;className?:string}){return <div className={`ui-content-panel ${className}`}>{children}</div>}
