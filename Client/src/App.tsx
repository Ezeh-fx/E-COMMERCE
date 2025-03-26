import { RouterProvider } from "react-router-dom";
import mainRoute from "./router/mainRouter";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./global/store"; // ✅ Import persistor

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={mainRoute} />
      </PersistGate>
    </Provider>
  );
};

export default App;