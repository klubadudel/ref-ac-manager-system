document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded');
  
    // Toast function
    function showToast(message, type = 'info', duration = 3000) {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerText = message;
      document.body.appendChild(toast);
  
      setTimeout(() => {
        toast.remove();
      }, duration);
    }
  
    // Firebase functions
    function saveUnit(unitId, unitData) {
      const unitRef = ref(database, 'units/' + unitId);
      set(unitRef, unitData);
    }
  
    function updateUnit(unitId, unitData) {
      const unitRef = ref(database, 'units/' + unitId);
      update(unitRef, { details: unitData });
    }
  
    function deleteUnit(unitId) {
      const unitRef = ref(database, 'units/' + unitId);
      remove(unitRef);
    }
  
    // Dummy handlers for buttons
    window.openModal = function (unitId) {
      showToast(`Opening details for ${unitId}`, 'info');
    };
  
    window.removeUnit = function (unitId) {
      if (confirm('Are you sure you want to remove this unit?')) {
        deleteUnit(unitId);
        showToast('Unit removed successfully', 'success');
      }
    };
  
    window.editUnit = function (unitId) {
      let newDetails = prompt("Enter new details for the unit:");
      if (newDetails) {
        updateUnit(unitId, newDetails);
        showToast('Unit updated successfully', 'success');
      }
    };
  
    window.showAddUnitModal = function (type) {
      let unitName = prompt(`Enter new ${type} unit name:`);
      let unitStatus = prompt('Enter status for the unit:');
      let unitData = {
        name: unitName,
        status: unitStatus,
        timestamp: new Date().toISOString()
      };
      if (unitName && unitStatus) {
        saveUnit(unitName, unitData);
        showToast(`${type} unit added successfully`, 'success');
      }
    };
  });
  