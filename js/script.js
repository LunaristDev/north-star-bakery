document.addEventListener('DOMContentLoaded', function () {
  initSavedItems();
  initContactForm();
});

const SAVED_ITEMS_KEY = 'northStarBakerySavedItems';

function initSavedItems() {
  const saveButtons = document.querySelectorAll('.save-btn');
  const savedList = document.getElementById('saved-items-list');
  const savedEmptyMessage = document.getElementById('saved-items-empty');

  if (saveButtons.length === 0 || !savedList) {
    return;
  }

  let savedItems = loadSavedItems();

  saveButtons.forEach(function (button) {
    setButtonAppearance(button, savedItems.indexOf(button.dataset.item) !== -1);

    button.addEventListener('click', function () {
      savedItems = toggleSavedItem(button.dataset.item, savedItems);
      setButtonAppearance(button, savedItems.indexOf(button.dataset.item) !== -1);
      renderSavedList(savedItems, savedList, savedEmptyMessage);
    });
  });

  renderSavedList(savedItems, savedList, savedEmptyMessage);
}

function toggleSavedItem(itemName, items) {
  const index = items.indexOf(itemName);

  if (index === -1) {
    items.push(itemName);
  } else {
    items.splice(index, 1);
  }

  saveItemsToStorage(items);
  return items;
}

function loadSavedItems() {
  const stored = localStorage.getItem(SAVED_ITEMS_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    return [];
  }
}

function saveItemsToStorage(items) {
  localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
}

function setButtonAppearance(button, isSaved) {
  if (isSaved) {
    button.textContent = '★ Saved';
    button.classList.add('saved');
  } else {
    button.textContent = '☆ Save for Later';
    button.classList.remove('saved');
  }
}

function renderSavedList(items, listElement, emptyMessageElement) {
  listElement.innerHTML = '';

  if (items.length === 0) {
    if (emptyMessageElement) {
      emptyMessageElement.hidden = false;
    }
    return;
  }

  if (emptyMessageElement) {
    emptyMessageElement.hidden = true;
  }

  items.forEach(function (itemName) {
    const listItem = document.createElement('li');
    listItem.textContent = itemName;
    listElement.appendChild(listItem);
  });
}

function initContactForm() {
  const form = document.querySelector('#inquiry-form form');

  if (!form) {
    return;
  }

  const successMessage = document.getElementById('form-success');

  const formFields = [
    {
      input: document.getElementById('name'),
      errorId: 'name-error',
      validate: function (input, errorId) {
        return validateRequired(input, errorId, 'Please enter your name.');
      }
    },
    {
      input: document.getElementById('email'),
      errorId: 'email-error',
      validate: validateEmail
    }
  ];

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    let isFormValid = true;
    formFields.forEach(function (fieldInfo) {
      const isFieldValid = fieldInfo.validate(fieldInfo.input, fieldInfo.errorId);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      if (successMessage) {
        successMessage.hidden = false;
      }
      form.reset();
    } else if (successMessage) {
      successMessage.hidden = true;
    }
  });

  formFields.forEach(function (fieldInfo) {
    fieldInfo.input.addEventListener('input', function () {
      fieldInfo.validate(fieldInfo.input, fieldInfo.errorId);
    });
  });
}

function validateRequired(field, errorId, message) {
  if (field.value.trim() === '') {
    showError(errorId, message);
    return false;
  }
  clearError(errorId);
  return true;
}

function validateEmail(field, errorId) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const value = field.value.trim();

  if (value === '') {
    showError(errorId, 'Please enter your email address.');
    return false;
  }

  if (!emailPattern.test(value)) {
    showError(errorId, 'Please enter a valid email address, like name@example.com.');
    return false;
  }

  clearError(errorId);
  return true;
}

function showError(errorId, message) {
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(errorId) {
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = '';
  }
}
