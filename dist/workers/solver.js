'use strict';
importScripts(
  '../domain/battle/heart-stats.js',
  '../domain/optimization/solver.js'
);
self.onmessage=event=>{const {master,profile,contentId,policy}=event.data;try{const result=PartySolver.solve(master,profile,contentId,policy);self.postMessage({result});}catch(error){self.postMessage({error:error.message});}};
