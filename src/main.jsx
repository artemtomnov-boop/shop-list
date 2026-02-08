import { createRoot } from "react-dom/client";
import List from "./List.jsx";


const root = createRoot(document.getElementById('root'));



root.render(
  <div style={{fontSize: '44px'}}>
    <div>
      <List />
    </div>
  </div>
);
