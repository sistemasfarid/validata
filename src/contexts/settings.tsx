import { ReactNode, createContext, useState, useEffect } from "react";
import { companyProps } from "../screens/Settings";
import { filterProps } from "../components/FilterModal";
import getCompanyCredentials from "../storage/company/getCompany.credentials";

import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import saveCompanyCredentials from "../storage/company/saveCompany.credentials";
import saveFilterCredentials, {
  saveFilterProps,
} from "../storage/filter/saveFilter.credentials";
import deleteFilterCredentials from "../storage/filter/deleteFilter.credentials";
import saveDateFilterCredentials, {
  filterDateProps,
} from "../storage/filter/saveDateFilter.credentials";

import deleteDateFilterCredentials from "../storage/filter/deleteDateFilter.credentials";

type AppSettingsContextData = {
  saveCompany: ({ EmpresaId, EmpresaNome }) => Promise<void>;
  getCompany: () => Promise<void>;
  saveFilter: ({ Id, Nome }) => Promise<void>;
  deleteFilter: () => Promise<void>;
  saveDateFilter: ({ initialDate, finalDate, periodName }) => Promise<void>;
  deleteDateFilter: () => Promise<void>;
  company: companyProps;
  filter: saveFilterProps;
  dateFilter: filterDateProps;
  isLoading: boolean;
};

export const AppSettingsContext = createContext<AppSettingsContextData>(
  {} as AppSettingsContextData
);

type ProviderProps = {
  children: ReactNode;
};

export function AppSettingsProvider({ children }: ProviderProps) {
  const navigation = useNavigation();
  const [company, setCompany] = useState<companyProps>();
  const [filter, setFilter] = useState<saveFilterProps>();
  const [dateFilter, setDateFilter] = useState<filterDateProps>();
  const [isLoading, setIsLoading] = useState(true);
  async function saveCompany({ EmpresaId, EmpresaNome }: companyProps) {
    await saveCompanyCredentials({ EmpresaId, EmpresaNome });
    setCompany({ EmpresaId, EmpresaNome });
  }

  async function getCompany() {
    try {
      const comp = await getCompanyCredentials();
      if (!comp) {
        Toast.show({
          type: "error",
          text1: "É necessário escolher uma unidade primeiro!",
          text2: "Escolha um empresa a baixo para continuar",
        });
        //@ts-ignore
        return navigation.navigate("AppScreens", { screen: "Settings" });
      }
      setCompany(comp);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveFilter(filter: filterProps) {
    const filterData = {
      filterId: filter.Id,
      filterName: filter.Nome,
    };
    await saveFilterCredentials(filterData);
    setFilter(filterData);
  }

  async function deleteFilter() {
    await deleteFilterCredentials();
    setFilter(undefined);
    Toast.show({
      type: "success",
      text1: "Filtros limpos!",
      text2: "Todos os produtos serão listados",
    });
    navigation.navigate("CheckList");
    navigation.navigate("ProductList");
  }

  async function saveDateFilter({
    initialDate,
    finalDate,
    periodName,
  }: filterDateProps) {
    await saveDateFilterCredentials({ initialDate, finalDate, periodName });
    setDateFilter({ initialDate, finalDate, periodName });   

    navigation.navigate("ProductList");
  }

  async function deleteDateFilter() {
    try {
      await deleteDateFilterCredentials();
      setDateFilter(undefined);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCompany();
  }, []);

  return (
    <AppSettingsContext.Provider
      value={{
        saveCompany,
        getCompany,
        saveFilter,
        deleteFilter,
        saveDateFilter,
        deleteDateFilter,
        company,
        filter,
        dateFilter,
        isLoading,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}
