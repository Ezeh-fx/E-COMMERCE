import { RouterProvider } from "react-router-dom";
import mainRoute from "./router/mainRouter";
import { Provider } from "react-redux";
import { store } from "./global/store"; // ✅ Import persistor

const App = () => {
  return (
    <Provider store={store}>
        <RouterProvider router={mainRoute} />
    </Provider>
  );
};

export default App;