// Add the code to select the first tab and update the menu on page load
window.addEventListener('load', () => {
    tabs[0].classList.add('active');
    selectedTab = 1; // Select the first tab
    updateMenu(); // Update the menu
});

// JavaScript code for handling tab clicks and menu items
const tabs = document.querySelectorAll('.tab');
const menuContainer = document.querySelector('.menu-container');
const chosenItems = document.querySelector('.chosen-items');
const totalPrice = document.getElementById('total-price');
const homeButton = document.getElementById('home-button');
const orderButton = document.getElementById('order-button');
const chosenMenuCount = document.getElementById('chosen-menu-count');
const optionModal = document.querySelector('.modal');
const optionModalSaveButton = document.getElementById('option-modal-save');
const setOptionRadioButtons = document.querySelectorAll('input[name="set-option"]');

let selectedTab = 1;
let chosenMenu = [];

// Define the menuData object with image URLs
const menuData = {
    1: [
        { name: '헬로디아블로 팩1', price: 21000, image: 'static/images/t1_m1.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '헬로디아블로 팩2', price: 21000, image: 'static/images/t1_m2.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '헬로디아블로 팩3', price: 20000, image: 'static/images/t1_m3.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '디아블로 스페셜 세트', price: 11000, image: 'static/images/t1_m4.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        // Add more menu items for Tab 1 with image URLs
    ],
    2: [
        { name: '오리지널스페퍼잭 싱글', price: 10800, image: 'static/images/t2_m1.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '오리지널스페퍼잭 더블', price: 14800, image: 'static/images/t2_m2.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '헬로 디아블로 와퍼', price: 13000, image: 'static/images/t2_m3.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '헬로 이나리우스 와퍼', price: 9500, image: 'static/images/t2_m4.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '헬로 릴리트 와퍼', price: 9500, image: 'static/images/t2_m5.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '더블비프불고기 버거', price: 5000, image: 'static/images/t2_m6.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        // Add more menu items for Tab 2 with image URLs
    ],

    3: [
        { name: '블랙바비큐콰트로치즈와퍼', price: 9300, image: 'static/images/t3_m1.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '블랙바비큐와퍼', price: 9300, image: 'static/images/t3_m2.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '몬스터와퍼', price: 9300, image: 'static/images/t3_m3.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '몬스터X', price: 100100, image: 'static/images/t3_m4.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '통새우와퍼', price: 7900, image: 'static/images/t3_m5.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '콰트로치즈와퍼', price: 7900, image: 'static/images/t3_m6.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        // Add more menu items for Tab 1 with image URLs
    ],
    4: [
        { name: '와퍼', price: 7100, image: 'static/images/t4_m1.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '불고기와퍼', price: 7100, image: 'static/images/t4_m2.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '치즈와퍼', price: 7700, image: 'static/images/t4_m3.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '갈릭불고기와퍼', price: 7400, image: 'static/images/t4_m4.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '콰트로치즈와퍼주니어', price: 5300, image: 'static/images/t4_m5.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '통새우와퍼주니어', price: 5300, image: 'static/images/t4_m6.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '와퍼주니어', price: 4700, image: 'static/images/t4_m7.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '불고기와퍼주니어', price: 4700, image: 'static/images/t4_m8.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '치즈와퍼주니어', price: 5000, image: 'static/images/t4_m9.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        // Add more menu items for Tab 2 with image URLs
    ],

    5: [
        { name: '치킨킹BLT', price: 7400, image: 'static/images/t5_m1.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '치킨킹', price: 6400, image: 'static/images/t5_m2.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '비프&슈림프버거', price: 7000, image: 'static/images/t5_m3.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '통새우슈림프버거', price: 6000, image: 'static/images/t5_m4.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '슈림프버거', price: 5000, image: 'static/images/t5_m5.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '롱치킨버거', price: 4700, image: 'static/images/t5_m6.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '바비큐치킨버거', price: 3700, image: 'static/images/t5_m7.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '치킨버거', price: 3700, image: 'static/images/t5_m8.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        // Add more menu items for Tab 1 with image URLs
    ],
    6: [
        { name: 'BLT오믈렛킹모닝', price: 7900, image: 'static/images/t6_m1.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '오믈렛킹모닝', price: 6990, image: 'static/images/t6_m2.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '더블비프불고기버거세트', price: 7900, image: 'static/images/t6_m3.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '롱치킨버거세트', price: 6990, image: 'static/images/t6_m4.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        // Add more menu items for Tab 2 with image URLs
    ],

    7: [
        { name: '트러플치즈프라이', price: 3000, image: 'static/images/t7_m01.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '해쉬브라운', price: 1800, image: 'static/images/t7_m02.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '너겟킹8조각', price: 2500, image: 'static/images/t7_m03.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '너겟킹', price: 2200, image: 'static/images/t7_m04.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '21치즈스틱', price: 1200, image: 'static/images/t7_m05.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '어니언링', price: 2400, image: 'static/images/t7_m06.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '바삭킹', price: 3000, image: 'static/images/t7_m07.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '바삭킹8조각+소스', price: 11400, image: 'static/images/t7_m08.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '쉐이킹프라이', price: 2400, image: 'static/images/t7_m09.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '크리미모짜볼', price: 2600, image: 'static/images/t7_m10.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '코코넛슈림프', price: 3900, image: 'static/images/t7_m11.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '치즈프라이', price: 3000, image: 'static/images/t7_m12.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '프렌치프라이', price: 2100, image: 'static/images/t7_m13.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '코울슬로', price: 2100, image: 'static/images/t7_m14.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '콘샐러드', price: 2100, image: 'static/images/t7_m15.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '사이드소스', price: 300, image: 'static/images/t7_m16.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '시즈닝', price: 300, image: 'static/images/t7_m17.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        // Add more menu items for Tab 1 with image URLs
    ],
    8: [
        { name: '망고 선데', price: 2300, image: 'static/images/t8_m01.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '컵 망고 아이스크림', price: 1300, image: 'static/images/t8_m02.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: 'Dole 후룻컵', price: 2000, image: 'static/images/t8_m03.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '아메리카노', price: 1500, image: 'static/images/t8_m04.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '핫초코', price: 2000, image: 'static/images/t8_m05.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '아이스초코', price: 2000, image: 'static/images/t8_m06.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '코카콜라', price: 2000, image: 'static/images/t8_m07.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '코카콜라 제로', price: 2000, image: 'static/images/t8_m08.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '스프라이트', price: 2000, image: 'static/images/t8_m09.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '스프라이트 제로', price: 2000, image: 'static/images/t8_m10.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '미닛메이드 오렌지', price: 2800, image: 'static/images/t8_m11.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        { name: '순수(미네랄워터)', price: 1300, image: 'static/images/t8_m12.png', options: {'단품': 7900,'레귤러세트': 8500,'라지세트': 9500} },
        // Add more menu items for Tab 2 with image URLs
    ],
    // Add data for other tabs with image URLs
};

// Function to update the menu based on the selected tab
function updateMenu() {
    menuContainer.innerHTML = '';

    if (menuData[selectedTab]) {
        menuData[selectedTab].forEach((item, index) => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');
            menuItem.innerHTML = `
                <img src="${item.image}" alt="${item.name} Image">
                <h3>${item.name}</h3>
                <p>가격 : ${item.price}원</p>
                <button class="add-to-order" data-index="${index}">장바구니에 담기</button>
            `;

            menuContainer.appendChild(menuItem);

            // Add click event listener to "Add to Order" button
            const addToOrderButton = menuItem.querySelector('.add-to-order');
            addToOrderButton.addEventListener('click', () => addToChosenMenu(item));
        });
    }
}

// Function to handle tab clicks
tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        selectedTab = parseInt(tab.getAttribute('data-tab'));
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        updateMenu();
    });
});

// Function to handle "Home" button click
homeButton.addEventListener('click', () => {
    selectedTab = 1;
    tabs.forEach((t) => t.classList.remove('active'));
    tabs[0].classList.add('active');
    updateMenu();

    // Clear the chosen menu
    chosenItems.innerHTML = '';
    chosenMenu = [];

    // Reset total price and chosen menu count
    totalPrice.textContent = '0원';
    chosenMenuCount.textContent = '0';
});

// Function to handle "Order" button click (You can customize this function)
orderButton.addEventListener('click', () => {
    alert('Order Placed!'); // Replace this with your desired order handling logic
});

// Initial update of the menu
updateMenu();

// Function to add items to the chosen menu
function addToChosenMenu(item, selectedOption) {
    // Calculate the total price for the chosen item including the selected option price
    const totalPriceForItem = item.options[selectedOption];

    // Create a card for the chosen item with the selected option
    const chosenCard = document.createElement('div');
    chosenCard.classList.add('chosen-item');
    chosenCard.innerHTML = `
        <div class="chosen-item-info">
            <p>${item.name} (${selectedOption}) <b>${totalPriceForItem}원</b></p>
        </div>
        <div class="modify-buttons">
            <button class="delete-button">삭제</button>
        </div>
    `;

    // Add event listener for the delete button
    const deleteButton = chosenCard.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => removeFromChosenMenu(chosenCard, item, selectedOption));

    // Find the chosen items container and add the chosen item card
    const chosenItems = document.querySelector('.chosen-items');
    chosenItems.appendChild(chosenCard);

    // Update total price and chosen menu count
    const totalPrice = document.getElementById('total-price');
    const chosenMenuCount = document.getElementById('chosen-menu-count');
    const currentTotal = parseFloat(totalPrice.textContent.replace('원', '').replace(',', ''));
    const newTotal = currentTotal + totalPriceForItem;
    totalPrice.textContent = `${newTotal.toLocaleString()}원`;
    chosenMenuCount.textContent = chosenItems.children.length;
}

// Function to handle "Add to Order" button click
function addToChosenMenu(item) {
    // Display the option modal
    const optionModal = document.getElementById('option-modal');
    optionModal.style.display = 'block';

    // Save the selected item and update modal content
    let selectedOption = '';

    // Add event listeners to radio buttons
    const optionRadioSingle = document.querySelector('input[name="set-option"][value="단품"]');
    const optionRadioRegular = document.querySelector('input[name="set-option"][value="레귤러세트"]');
    const optionRadioLarge = document.querySelector('input[name="set-option"][value="라지세트"]');

    optionRadioSingle.addEventListener('change', () => {
        selectedOption = '단품';
        addToChosenMenu(item, selectedOption);
    });
    optionRadioRegular.addEventListener('change', () => {
        selectedOption = '레귤러세트';
        addToChosenMenu(item, selectedOption);
    });
    optionRadioLarge.addEventListener('change', () => {
        selectedOption = '라지세트';
        addToChosenMenu(item, selectedOption);
    });

    // Add event listener to save button
    const optionModalSave = document.getElementById('option-modal-save');
    optionModalSave.addEventListener('click', () => {
        // Close the option modal
        optionModal.style.display = 'none';
    });
}


// Function to remove items from the chosen menu
function removeFromChosenMenu(chosenCard, item) {
    // Remove the chosen item card from the chosen menu
    chosenItems.removeChild(chosenCard);

    // Update total price and chosen menu count
    const currentTotal = parseFloat(totalPrice.textContent.replace('원', '').replace(',', ''));
    const newTotal = currentTotal - item.price;
    totalPrice.textContent = `${newTotal.toLocaleString()}원`;
    chosenMenuCount.textContent = chosenItems.children.length;

    // Remove the chosen item from the chosen menu array
    const itemIndex = chosenMenu.findIndex((menuItem) => menuItem.name === item.name);
    if (itemIndex !== -1) {
        chosenMenu.splice(itemIndex, 1);
    }
}


// Function to add items to the chosen menu
function addToChosenMenu(item) {
    // Display the option modal
    const optionModal = document.getElementById('option-modal');
    optionModal.style.display = 'block';

    // Save the selected item and update modal content
    let selectedOption = '';

    // Add event listeners to radio buttons
    const optionRadioSingle = document.querySelector('input[name="set-option"][value="단품"]');
    const optionRadioRegular = document.querySelector('input[name="set-option"][value="레귤러세트"]');
    const optionRadioLarge = document.querySelector('input[name="set-option"][value="라지세트"]');

    optionRadioSingle.addEventListener('change', () => {
        selectedOption = '단품';
    });
    optionRadioRegular.addEventListener('change', () => {
        selectedOption = '레귤러세트';
    });
    optionRadioLarge.addEventListener('change', () => {
        selectedOption = '라지세트';
    });

    // Add event listener to save button
    const optionModalSave = document.getElementById('option-modal-save');
    optionModalSave.addEventListener('click', () => {
        // Close the option modal
        optionModal.style.display = 'none';

        // Add the chosen item to the chosen menu array with selected option
        item.option = selectedOption;
        chosenMenu.push(item);

        // Create a card for the chosen item with the selected option
        const chosenCard = document.createElement('div');
        chosenCard.classList.add('chosen-item');
        chosenCard.innerHTML = `
            <div class="chosen-item-info">
                <p>${item.name} (${selectedOption}) <b>${item.price}원</b></p>
            </div>
            <div class="modify-buttons">
                <button class="delete-button">삭제</button>
            </div>
        `;

        // Add event listener for the delete button
        const deleteButton = chosenCard.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => removeFromChosenMenu(chosenCard, item));

        // Find the chosen items container and add the chosen item card
        const chosenItems = document.querySelector('.chosen-items');
        chosenItems.appendChild(chosenCard);

        // Update total price and chosen menu count
        const totalPrice = document.getElementById('total-price');
        const chosenMenuCount = document.getElementById('chosen-menu-count');
        const currentTotal = parseFloat(totalPrice.textContent.replace('원', '').replace(',', ''));
        const newTotal = currentTotal + item.price;
        totalPrice.textContent = `${newTotal.toLocaleString()}원`;
        chosenMenuCount.textContent = chosenItems.children.length;
    });
}
