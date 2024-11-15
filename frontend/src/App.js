import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LoginPortal from './login/LoginPortal';

import SystemAdmin from './login/SystemAdmin';
import SystemAdminDashboard from './SystemAdmin/Dashboard';
import SystemAdminDocuments from './SystemAdmin/Document'
import SystemAdminInventory from './SystemAdmin/inventory'
import SystemAdminRawMaterials from './SystemAdmin/RawMats';
import SystemAdminSupplier from './SystemAdmin/Supplier';
import SystemAdminAccountRoles from './SystemAdmin/AccountRoles.js';
import Tags from './SystemAdmin/CategoryTable';


import DataAdmin from './login/DataAdmin';
import DataAdminDashboard from './DataAdmin/Dashboard';
import DataAdminInventory from './DataAdmin/inventory';
import DataAdminRawMats from './DataAdmin/RawMats';
import DataAdminSupplier from './DataAdmin/Supplier';
import DataAdminSupplyDelivery from './DataAdmin/SupplyDeliveries';
import DataAdminProduction from './DataAdmin/Production';
import DataAdminProductionMaterialsLogs from './DataAdmin/ProductionMaterialsLog.js';



import SalesAdmin from './login/SalesAdmin';
import SalesAdminDashboard from './SalesAdmin/Dashboard';
import SalesAdminOrder from './SalesAdmin/Order';
import PerparingOrders  from './SalesAdmin/PreparingOrders.js';
import DeliveryOrders  from './SalesAdmin/DeliveryOrder.js';
import Sales  from './SalesAdmin/Sales.js';
import Cancelled  from './SalesAdmin/Cancelled.js';




import Dashboard from './Dashboard';
// // import Document from './Document/Document';
// import Inventory from './inventory/inventory';
// import AddInventory from './inventory/addInventory';
// import UpdateInventory from './inventory/UpdateInventory';
// import ProdWork from './productionWorker/prodWork';
// import AddProdWork from './productionWorker/AddProdWork';
// import RawMats from './RawMats/RawMats';
// import AddRawMats from './RawMats/addRawMats';
// import UpdateRawMats from './RawMats/UpdateRawMats';
// import Supplier from './Supplier/Supplier';
// import AddSupplier from './Supplier/AddSupplier';
// import UpdateSupplier from './Supplier/UpdateSupplier';
// import SupplyDeliveries from './SupplyDeliveries/SupplyDeliveries';
// import AddSupDeli from './SupplyDeliveries/AddSupDeli';
// import UpdateSupDeli from './SupplyDeliveries/UpdateSupDeli';
// import Customer from './Customer/Customer';
// import Order from './Order/Order';
// import Production from './Production/Production';
// import Delivery from './Deliveries/Deliveries';
// import DeliWork from './deliveryWorker/DeliWork';
// import AddDeliWork from './deliveryWorker/AddDeliWork';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={user ? <Navigate to='/dashboard' /> : <Login setUser={setUser} />} /> */}
          <Route path="/" element={<LoginPortal />} />

          
          <Route path="/system-admin" element={<SystemAdmin />} />
          <Route path="/system-admin/dashboard" element={<SystemAdminDashboard />} />
          <Route path="/system-admin/document" element={<SystemAdminDocuments/>} />
          <Route path="/system-admin/inventory" element={<SystemAdminInventory />} />
          <Route path="/system-admin/raw-material" element={<SystemAdminRawMaterials />} />
          <Route path="/system-admin/supplier" element={<SystemAdminSupplier />} />
          <Route path="/system-admin/account" element={<SystemAdminAccountRoles />} />
          <Route path="/system-admin/tags" element={<Tags />} />




          <Route path="/data-admin" element={<DataAdmin />} />
          <Route path="/data-admin/dashboard" element={<DataAdminDashboard />} />
          <Route path='/data-admin/product' element={<DataAdminInventory/>} />
          <Route path='/data-admin/raw-material' element={<DataAdminRawMats/>} />
          <Route path='/data-admin/supplier' element={<DataAdminSupplier/>} />
          <Route path='/data-admin/supply-delivery' element={<DataAdminSupplyDelivery/>} />
          <Route path='/data-admin/production' element={<DataAdminProduction/>} />
          <Route path='/data-admin/production-material-logs' element={<DataAdminProductionMaterialsLogs/>} />
          



          <Route path="/sales-admin" element={<SalesAdmin />} />
          <Route path="/sales-admin/dashboard" element={<SalesAdminDashboard />} />
          <Route path="/sales-admin/order" element={<SalesAdminOrder />} />
          <Route path="/sales-admin/preparing" element={<PerparingOrders />} />
          <Route path="/sales-admin/on-delivery" element={<DeliveryOrders />} />
          <Route path="/sales-admin/sales" element={<Sales />} />
          <Route path="/sales-admin/cancelled" element={<Cancelled />} />
          


          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/add" element={<AddInventory />} />
          <Route path="/inventory/update/:itemId" element={<UpdateInventory />} />
          <Route path='/RawMats' element={<RawMats />} />
          <Route path='/RawMats/add' element={<AddRawMats />} />
          <Route path='/RawMats/update/:matId' element={<UpdateRawMats />} />
          <Route path='/Supplier' element={<Supplier />} />
          <Route path='/Supplier/add' element={<AddSupplier />} />
          <Route path='/Supplier/update/:supplyId' element={<UpdateSupplier />} />
          <Route path='/SupplyDeliveries' element={<SupplyDeliveries />} />
          <Route path='/SupplyDeliveries/add' element={<AddSupDeli />} />
          <Route path='/supDeli/update/:deliveryId' element={<UpdateSupDeli/>} />
          <Route path="/ProdWork" element={<ProdWork />} />
          <Route path='/ProdWork/add' element={<AddProdWork />} />
          <Route path="/document" element={<Document />} />
          <Route path="/deliwork" element={<DeliWork />} />
          <Route path='/deliwork/add' element={<AddDeliWork />} />
          <Route path='/Production' element={<Production />} />
          <Route path='/delivery' element={<Delivery />} />
          <Route path='/Order' element={<Order />} />
          <Route path='/Customer' element={<Customer />} />  */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
