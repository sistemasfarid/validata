import { createStackNavigator } from "@react-navigation/stack";
import AppScreens from "./AppScreens.routes";
import ProductScreen from "../screens/ProductScreen";
import { AppSettingsProvider } from "../contexts/settings";
import { ActivityIndicator } from "react-native";

const { Navigator, Screen } = createStackNavigator();

export default function ProductRoutes() {
  return (
    <AppSettingsProvider>
      <Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="AppScreens"
      >
        <Screen name="AppScreens" component={AppScreens} />
        <Screen name="ProductScreen" component={ProductScreen} />
      </Navigator>
    </AppSettingsProvider>
  );
}