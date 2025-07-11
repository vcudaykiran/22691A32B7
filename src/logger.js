import { createContext, useContext, useState } from "react";

const LoggerContext = createContext();
export const useLogger = () => useContext(LoggerContext);

export const LoggerProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const log = (msg) => setLogs((l) => [...l, `${new Date().toLocaleTimeString()}: ${msg}`]);
  return <LoggerContext.Provider value={{ log, logs }}>{children}</LoggerContext.Provider>;
};