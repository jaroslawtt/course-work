import Header from "./Components/header";
import Main from "./Components/main"
function App() {
  return (
    <div className="App bg-gray-900 h-screen text-white flex flex-col">
        <Header></Header>
            <Main/>
    </div>
  );
}

export default App;
