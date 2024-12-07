// let options = "<option disabled selected value> -- select a rating 1 - 5 -- </option>";

// for (let i = 1; i <= 5; i++) {
//     let opt = "<option value=" + i + ">" + i + "</option>";
//     options += opt;
// }

//////////////////////////////////// Load Table ///////////////////////////////////
function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/trips");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var trHTML = "";
            var num = 1;
            const patients = JSON.parse(this.responseText);
            for (let patient of patients) {
                trHTML += "<tr>";
                trHTML += "<td>" + num + "</td>";
                trHTML += "<td>" + patient["name"] + "</td>";
                trHTML += "<td>" + patient["num_reviews"] + "</td>";
                trHTML += "<td>" + patient["ranking_out_of"] + "</td>";
                trHTML += "<td>" + patient["ranking"] + "</td>";
                trHTML += "<td>" + patient["rating"] + "</td>";
                trHTML += "<td>" + (patient["price_level"] ? patient["price_level"] : "$-$$") + "</td>";

                trHTML +=
                    '<td><i class ="btn text-primary bi bi-pencil-square" onclick = "update(\'' +
                    patient["_id"] +
                    "')\"></i>";
                trHTML +=
                    '<i class = "btn text-danger bi bi-trash3-fill" onclick = "patientDelete(\'' +
                    patient["_id"] +
                    "')\"></i></td>";
                trHTML += "</tr>";
                num++;
            }

            document.getElementById("patientTable").innerHTML = trHTML;
        }
    };
}


//////////////////////////////////// Load Table ///////////////////////////////////

//////////////////////////////////// del row ///////////////////////////////////
function patientDelete(id) {
  console.log("Delete: ", id);

  Swal.fire({
    title: 'Are you sure you want to delete this???',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete IT!!'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:3000/trips/delete/${id}`, { // Corrected endpoint URL
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          Swal.fire("Deleted!", "data deleted successfully.", "success");
          loadTable();
        } else {
          Swal.fire("Failed!", "Failed to delete data.", "error");
        }
      })
      .catch(error => {
        console.error('Error deleting patient:', error);
        Swal.fire("Error!", "An unexpected error occurred.", "error");
      });
    }
  });
}

//////////////////////////////////// del row ///////////////////////////////////


//////////////////////////////////// Create Table ///////////////////////////////////

function showUserCreateBox() {

  Swal.fire({
    title: 'เพิ่มข้อมูลผู้ป่วย',
    html: 
    '<div class="mb-3"><label for="name" class="form-label float-start">Name</label>' +
    '<input class="form-control" id="name" placeholder="Restarant Name"></div>' +

    '<div class="mb-3"><label for="review" class="form-label float-start">Review</label>' +
    '<input class="form-control" id="review" placeholder="Total number of review"></div>' +

    '<div class="mb-3"><label for="rankingof" class="form-label float-start">Ranking of</label>' +
    '<input class="form-control" id="rankingof" placeholder="Ranking out of what"></div>' +

    '<div class="mb-3"><label for="ranking" class="form-label float-start">Ranking</label>' +
    '<input class="form-control" id="ranking" placeholder="Ranking"></div>' +

    '<div class="mb-3"><label for="rating" class="form-label float-start">Rating</label>' +
    `<input class="form-control" id="rating" placeholder="Rating 1-5"></input></div>` +

    '<div class="mb-3"><label for="price" class="form-label float-start">Price Level</label>' +
    '<input class="form-control" id="price" placeholder="$-$$ , $$$"></div>',

    
    focusConfirm: true,
    showCancelButton: false,
    cancelButtonText: 'ยกเลิก',
    confirmButtonText: 'บันทึก',
    preConfirm: () => {
      createNewPatient();
    }
  })
}

function createNewPatient() {
  // Get input values from the form
  const name = document.getElementById('name').value;
  const num_reviews = document.getElementById('review').value;
  const ranking_out_of = document.getElementById('rankingof').value;
  const ranking = document.getElementById('ranking').value;
  const rating = document.getElementById('rating').value;
  const price_level = document.getElementById('price').value;
  
  // if (!(/^\d+$/.test(num_reviews))) {
  //   Swal.fire("Alert!", "กรุณาใส่ตัวเลขเฉพาะในช่อง 'Number of Reviews'", "info")    ;
  //   return;
  // }

  // if (!(/^\d+$/.test(ranking_out_of))) {
  //   Swal.fire("Alert!", "กรุณาใส่ตัวเลขเฉพาะในช่อง 'Ranking out of'", "info");
  //   return;
  // }

  // if (!(/^\d+$/.test(ranking))) {
  //   Swal.fire("Alert!", "กรุณาใส่ตัวเลขเฉพาะในช่อง 'Ranking'", "info");
  //   return;
  // }

  // if (!(/^\d+$/.test(rating))) {
  //   Swal.fire("Alert!", "กรุณาใส่ตัวเลขเฉพาะในช่อง 'Rating'", "info");
  //   return;
  // }

  // if (price_level !== '$' && price_level !== '$$' && price_level !== '$$$') {
  //   Swal.fire("Alert!", "กรุณาใส่เฉพาะสัญลักษณ์ $ เท่านั้นในช่อง 'Price Level'", "info");
  //   return;
  // }
  // Create a JSON object with the patient data
  const data = {
    name: name,
    num_reviews: num_reviews,
    ranking_out_of: ranking_out_of,
    ranking: ranking,
    rating: rating,
    price_level: price_level
  };

  // Send a POST request to the server to create the patient
  fetch('http://localhost:3000/trips/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Handle success response here (if needed)
    console.log('Error:', data);
    Swal.fire("Alert!", "เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
    loadTable();
  })
  .catch(error => {
    // Handle error here
    console.error(':', error);
    Swal.fire("Success!", "บันทึกข้อมูลเรียบร้อย", "success");
    loadTable();
  });
}

//////////////////////////////////// Create Table ///////////////////////////////////

//////////////////////////////////// update ///////////////////////////////////
function update(id) {
  // ค้นหาข้อมูลจากไอดีก่อน
  fetch(`http://localhost:3000/trips/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // แสดงกล่อง swal.fire หลังจากได้ข้อมูลมาแล้ว
      Swal.fire({
        title: 'แก้ไขข้อมูลร้านอาหาร',
        html: 
        '<div class="mb-3"><label for="name" class="form-label float-start">Name</label>' +
        `<input class="form-control" id="name" placeholder="Restarant Name" value="${data.name}"></div>` +

        '<div class="mb-3"><label for="review" class="form-label float-start">Review</label>' +
        `<input class="form-control" id="review" placeholder="Total number of review" value="${data.num_reviews}"></div>` +

        '<div class="mb-3"><label for="rankingof" class="form-label float-start">Ranking of</label>' +
        `<input class="form-control" id="rankingof" placeholder="Ranking out of what" value="${data.ranking_out_of}"></div>` +

        '<div class="mb-3"><label for="ranking" class="form-label float-start">Ranking</label>' +
        `<input class="form-control" id="ranking" placeholder="Ranking" value="${data.ranking}"></div>` +

        '<div class="mb-3"><label for="rating" class="form-label float-start">Rating</label>' +
        `<input class="form-control" id="rating" placeholder="Rating 1-5" value="${data.rating}"></div>` +

        '<div class="mb-3"><label for="price" class="form-label float-start">Price Level</label>' +
        `<input class="form-control" id="price" placeholder="$-$$ , $$$" value="${data.price_level}"></div>`,

        
        focusConfirm: true,
        showCancelButton: true,
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'บันทึก',
        preConfirm: () => {
          updatePatient(id);
        }
      })
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire("Alert!", "เกิดข้อผิดพลาดในการโหลดข้อมูล", "error");
    });
}

function updatePatient(id) {
  // Get input values from the form
  const name = document.getElementById('name').value;
  const num_reviews = document.getElementById('review').value;
  const ranking_out_of = document.getElementById('rankingof').value;
  const ranking = document.getElementById('ranking').value;
  const rating = document.getElementById('rating').value;
  const price_level = document.getElementById('price').value;
  
  // Create a JSON object with the patient data
  const restarant = {
    name: name,
    num_reviews: num_reviews,
    ranking_out_of: ranking_out_of,
    ranking: ranking,
    rating: rating,
    price_level: price_level
  };

  // Send a PUT request to the server to update the patient
  fetch(`http://localhost:3000/trips/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(restarant)
  })
  .then(data => {
    // Handle success response here (if needed)
    console.log('Success:', data);
    Swal.fire("Success!", "บันทึกข้อมูลเรียบร้อย", "success");
    loadTable();
  })
  .catch(error => {
    // Handle error here
    console.error('Error:', error);
    Swal.fire("Alert!", "เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
    loadTable();
  });
}
//////////////////////////////////// update ///////////////////////////////////

//////////////////////////////////// Sort ///////////////////////////////////
function tablesort() {

  const searchText = document.getElementById('KeywordSearch').value;
  if (searchText == "") {
    loadTable();
  } else {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `http://localhost:3000/trips/name/${searchText}`);
  xhttp.send();

  xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
          if (this.status == 200) {
              console.log(this.responseText);
              var trHTML = "";
              var num = 1;
              const patients = JSON.parse(this.responseText);
              if (patients.length > 0) {
                  for (let patient of patients) {
                      trHTML += "<tr>";
                      trHTML += "<td>" + num + "</td>";
                      trHTML += "<td>" + patient["name"] + "</td>";
                      trHTML += "<td>" + patient["num_reviews"] + "</td>";
                      trHTML += "<td>" + patient["ranking_out_of"] + "</td>";
                      trHTML += "<td>" + patient["ranking"] + "</td>";
                      trHTML += "<td>" + patient["rating"] + "</td>";
                      trHTML += "<td>" + (patient["price_level"] ? patient["price_level"] : "$-$$") + "</td>";
                      trHTML += '<td><i class="btn text-primary bi bi-pencil-square" onclick="update(\'' + patient["_id"] + "')\"></i>";
                      trHTML += '<i class="btn text-danger bi bi-trash3-fill" onclick="patientDelete(\'' + patient["_id"] + "')\"></i></td>";
                      trHTML += "</tr>";
                      num++;
                  }
              } else {
                  trHTML = "<tr><td colspan='8'>Data not found</td></tr>";
              }

              document.getElementById("patientTable").innerHTML = trHTML;
          } else {
              console.error("Error:", this.status);
              var trHTML = "<tr><td colspan='8'>Error occurred while fetching data</td></tr>";
              document.getElementById("patientTable").innerHTML = trHTML;
          }
      }
  };
}}
//////////////////////////////////// Sort ///////////////////////////////////
/////////////////////////// login //////////////////////////////
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const data = {
    Username: username,
    Password: password
  };

  // เชื่อมต่อไปยังเซิร์ฟเวอร์เพื่อตรวจสอบข้อมูลเข้าสู่ระบบ
  fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
  })
  .then(response => {
      if (response.ok) {
          return response.text();
      }
      console.log(data);
      throw new Error("Login failed");
  })
  .then(data => {
      
      swal.fire("Success!", data, "success"); 
      
      // document.getElementById('long').removeAttribute('hidden');
      var loginModal = document.getElementById('Login');
      var modal = bootstrap.Modal.getInstance(loginModal);
      
      document.getElementById('KeywordSearch').removeAttribute('disabled');
      document.getElementById('showbox').removeAttribute('disabled');
      document.getElementById('KeywordSearch').setAttribute('placeholder', 'ค้นหาร้านอาหาร');
      var loginButton = document.querySelector('.btn-dark');


      loginButton.innerHTML = '<i class="bi bi-door-open"></i> Logout';

  
      loginButton.setAttribute('data-bs-target', '');


      loginButton.setAttribute('onclick', 'confirmLogout()');


      modal.hide();
      loadTable(); 
      
  })
  .catch(error => {
      console.error("Error:", error); // ไม่สามารถเข้าสู่ระบบได้: แสดงข้อความผิดพลาด (เช่น "Invalid credentials")
      swal.fire("Error!", "Login failed. Please try again.", "error"); // แสดงข้อความ error ด้วย swal.fire
  });
}
/////////////////////////// login //////////////////////////////
function confirmLogout() {
  Swal.fire({
    title: 'Are you sure you want to logout?',
    text: 'You will be logged out of your account',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, logout'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/Back/Front/index.html";
    }
  });
}

