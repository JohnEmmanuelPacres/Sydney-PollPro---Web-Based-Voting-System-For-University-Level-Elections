'use client';
import React, { createContext, useContext, useState } from 'react';

   const AdminOrgContext = createContext<{
     administeredOrg: string | null;
     setAdministeredOrg: (org: string) => void;
   }>({ administeredOrg: null, setAdministeredOrg: () => {} });

   export const useAdminOrg = () => useContext(AdminOrgContext);

   export const AdminOrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [administeredOrg, setAdministeredOrg] = useState<string | null>(null);
     return (
       <AdminOrgContext.Provider value={{ administeredOrg, setAdministeredOrg }}>
         {children}
       </AdminOrgContext.Provider>
     );
   };