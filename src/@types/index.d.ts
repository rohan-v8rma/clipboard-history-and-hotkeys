declare module 'clipboard-event' {
    import {
      EventEmitter 
    } from "events";
  
    class ClipboardEventListener extends EventEmitter {
      constructor();
          
      startListening(): void;
      stopListening(): void;
    }
      
    const ClipboardEventListenerInstance: ClipboardEventListener;
    export default ClipboardEventListenerInstance;
}
  
  

// export type { default }  from './clipboard-event.d.ts';