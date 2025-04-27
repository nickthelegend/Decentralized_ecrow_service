import { Contract } from '@algorandfoundation/tealscript';

type Department = {
  manager: Address;
//   inventory: BoxMap<string, uint64>; // Product -> quantity
};

export class DepartmentsContract extends Contract {
    admin = GlobalStateKey<Address>(); // Store the admin address
    totalProducts = GlobalStateKey<uint64>(); // Track total number of products
    totalDepartments = GlobalStateKey<uint64>(); // Track total number of departments
    lastUpdated = GlobalStateKey<uint64>(); // Timestamp of last inventory update
    companyName = GlobalStateKey<string>(); // Company name
  // BoxMap to store department data: name -> manager and inventory
  departments = BoxMap<string, Department>();

  departmentInventory = BoxMap<string, uint64>({ prefix: 'inv_' }); // Format: "departmentName:productName" -> quantity

  createApplication(
    adminAddress: Address,
    company: string
  ): void {
    // Ensure this is only called during application creation
    assert(this.app.id == 0, "This method can only be called during application creation");
    
    // Set initial global state values
    this.admin.value = adminAddress;
    this.companyName.value = company;
    this.lastUpdated.value = globals.latestTimestamp;
    
    // Log the creation event
    log("Inventory DApp created for: " + company);
  }


  // Only company admin can register departments
  registerDepartment(name: string, manager: Address): void {
    assert(this.txn.sender == this.app.creator, "Only company admin can register departments.");
    assert(!this.departments(name).exists, "Department already exists.");

    this.departments(name).value = {
      manager: manager,
    };

    log("Department registered: " + name);
  }


  addInventory(department: string, product: string, quantity: uint64): void {
    // Create a composite key
    const key = department + ":" + product;
    this.departmentInventory(key).value = quantity;
  }

  useStock(department: string, product: string, quantity: uint64): void {
    // Verify the department exists
    assert(this.departments(department).exists, "Department does not exist.");
  
    // Create the composite key for inventory
    const key = department + ":" + product;
  
    // Verify product exists in inventory
    assert(this.departmentInventory(key).exists, "Product not in inventory.");
  
    // Verify sufficient quantity
    const currentQuantity = this.departmentInventory(key).value;
    assert(currentQuantity >= quantity, "Insufficient stock available.");
  
    // Update inventory
    if (currentQuantity == quantity) {
      // If using all stock, delete the entry to save storage
      this.departmentInventory(key).delete();
    } else {
      // Reduce the quantity
      this.departmentInventory(key).value = currentQuantity - quantity;
    }
  
    log("Stock used: " + quantity.toString() + " of " + product + " from " + department);
  }


}
