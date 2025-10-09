//  JS for Toggle 
const neToggleBtn = document.querySelector('.ne-toggle');
    const neMobileNav = document.getElementById('neMobileNav');
    const neSearchIcon = document.querySelector('.ne-search-icon i');
    const neSearchBox = document.getElementById('neSearchBox');

    // Mobile menu toggle
    neToggleBtn.addEventListener('click', () => {
      neMobileNav.style.display = (neMobileNav.style.display === 'block') ? 'none' : 'block';
      neSearchBox.style.display = 'none'; // hide search when menu opens
    });

    // Search box toggle
    neSearchIcon.addEventListener('click', () => {
      neSearchBox.style.display = (neSearchBox.style.display === 'block') ? 'none' : 'block';
      neMobileNav.style.display = 'none'; // hide nav when search opens
    });
 