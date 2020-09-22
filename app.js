// dom
let logo = document.querySelector('.logo');
let form = document.querySelector('form');
let button = document.querySelector('.button');
let calculator = document.querySelector('.calculator');
let resultContainer = document.querySelector('.result-container');
let result = document.querySelector('.result');
let reset = document.querySelector('.reset');
let status = document.querySelector('.status');
let list = document.querySelector('ul');

let height = document.getElementById('height');
let weight = document.getElementById('weight');

// firebase
// Get a reference to the database service
const database = firebase.database();

function setStatus(bmi) {
  let status = '理想';
  // 参考：https://en.wikipedia.org/wiki/Body_mass_index
  if (bmi >= 18.5 && bmi <= 25) {
    status = "理想"
  } else if (bmi < 18.5) {
    status = "过轻"
  } else if (bmi > 25 && bmi <= 30) {
    status = "过重";
  } else if (bmi > 30 && bmi <= 35) {
    status = "轻度肥胖";
  } else if (bmi > 35 && bmi <= 40) {
    status = "中度肥胖";
  } else if (bmi > 40) {
    status = "重度肥胖";
  }
  return status
}

function setThemeColor(status) {
  let color = "#fff";
  switch (status) {
    case "理想":
      return color = "#86D73F";
    case "过轻":
      return color = "#31BAF9";
    case "过重":
      return color = "#FF982D ";
    case "轻度肥胖":
      return color = "#FF6C03";
    case "中度肥胖":
      return color = "#FF6C03";
    case "重度肥胖":
      return color = "#FF1200";
  }
}

// submit
button.addEventListener('click', function (e) {
  let height_value = height.value;
  let weight_value = weight.value;
  let time = new Date();
  if (!height_value || !weight_value) return;

  logo.style.display = 'none';
  button.style.display = 'none';
  form.style.display = 'none';
  calculator.style.justifyContent = 'center';
  database.ref('records').push({
    height: height_value,
    weight: weight_value,
    timestamp: time.getTime()
  })
  let bmi = weight_value / ((height_value / 100) ** 2);
  let statusContent = setStatus(bmi);
  let color = setThemeColor(statusContent);

  resultContainer.style.display = 'flex';
  resultContainer.style.color = color;
  result.style.borderColor = color;
  reset.style.background = color;
  status.textContent = statusContent;
})

// reset
reset.addEventListener('click', function (e) {
  height.value = null;
  weight.value = null;
  resultContainer.style.display = 'none';
  calculator.style.justifyContent = 'space-between';
  logo.style.display = 'block';
  button.style.display = 'block';
  form.style.display = 'block';
})

// records list
database.ref('records').on('value', function (snapshot) {
  let lists = '';
  let data = snapshot.val();
  // reverse
  let arr = []
  for (item in data) {
    arr.push(data[item])
  }
  arr.reverse();
  console.log(arr)
  arr.forEach(function (item) {
    let height_value = item.height;
    let weight_value = item.weight;
    let timestamp = new Date(item.timestamp);
    let bmi = weight_value / ((height_value / 100) ** 2);
    let time = `${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`
    let statusContent = setStatus(bmi);
    let color = setThemeColor(statusContent);
    lists += `
    <li style="border-left-color: ${color}">
      <span class="status">${statusContent}</span>
      <span>BMI<span class="value">${bmi.toFixed(2)}</span></span>
      <span>weight<span class="value">${weight_value}kg</span></span>
      <span>height<span class="value">${height_value}cm</span></span>
      <span class="value">${time}</span>
    </li>
    `;
  });
  list.innerHTML = lists;
})