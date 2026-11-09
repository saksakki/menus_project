// 백엔드 서버랑 통신을 위한 코드
// 1. 초기 데이터 및 자동 증감 ID 설정
let foodList = [];

// 내가 만든 서버로부터 데이터를 가져온다.
// 요청 http://127.0.0.1:8000/menus
// 이것을 수정에 이용한다면 서버는 모든 정보를 줄 것이고, 클라이언트는 다시 찾아야 한다.
// 서버나 클라이언트 모두에게 좋은 방법은 아님.
async function getAllMenus() {
  try {
    const re = await fetch("http://127.0.0.1:8000/menus")
    // method: get 방식
    console.log('불러오기 성공')

    if (!re.ok) throw new Error("전체메뉴 불러오지 못 함")
    return re.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

// 서버에게 검색어를 전달하고 검색어로 조회한 결과를 요청
// 무엇을 요청? 어떤 방식으로 요청? 넘겨줄 데이터가 있는가?
// 오전예제 매핑: 자장면 2 그릇 주세요. 요청은 자장면 요청. 넘겨줄 데이터는 2
// 검색어에 따라 리턴받은 데이터는 여러 개일 수 있다. 수정은 오직 한 개만 받아야 한다.
async function searchMenus(keyword = "") {
  try {
    // 프로토콜: 서버주소 포트번호 / 요청? kw 변수 그 뒤가 값
    // 이렇게 주소를 통해 넘기는 방식: get 방식. 단점 url 뒤에 붙여서 전다. 노출이 됨
    // 중요한 정보는 get으로 넘기지 않음
    // 주소 뒤에 변수를 전달하는 방식 > get
    const url = "http://127.0.0.1:8000/menus/search?kw=" + keyword
    console.log(url)
    // 서버에 데이터 요청
    // 이 파일의 origin은 ~:5500(5501)번, remote: 8000
    // remote에서는 cross origin이 발생 가능한 상황
    const re = await fetch(
      url, {
      method: "GET"
    })
    // 서버와 통신이 되었는지 확인하려고
    console.log('불러오기 성공')
    if (!re.ok) throw new Error('검색 결과를 못 가져옴');
    return re.json()
  } catch (error) {
    // 에러가 발생하면 콘솔에 에러 추적용 로그를 남기자.
    console.error(error) // error로 출력하면 빨간색으로 나와서 잘 보인다.
    // searchMenus를 호출한 코드가 잘 동작 되도록 빈 리스트 변수를 리턴한다.
    return []
  }
}

// 서버에게 메뉴를 저장해달라고 요청
// 요청명: /menus
// 방법: create 작업
// 넘길 값(menuObject): 키보드로 입력받아서 저장한 객체
async function addMenu(menuObject) {
  console.log(menuObject)
  try {
    const url = "http://127.0.0.1:8000/menus";
    const re = await fetch(
      url,
      {
        method: "POST", // get 방식은 url 뒤에 붙이지만 post 방식은 문서의 body에 저장해서 보낸다.
        // 그래서 아래의 headers 작업과 body 작업이 필요하다.
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuObject)  // html의 body영역에 넣은 값
      }
    )
    if (!re.ok) throw new Error("메뉴 등록 실패")
    //return re.json()  // 메뉴 추가 서비스는 호출위치로 리턴이 필수가 아니다
    return re.json()      // 필수는 아니지만 일반적으로 리턴을 하기도 합니다.
  } catch (error){
    console.log(error);
    alert("메뉴 등록 중 오류 발생")
  }
}

// 서버에게 메뉴를 삭제해달라고 요청
// 요청명: /menus/id
// 메소드: DELETE
// 넘길 값: id (path 파라미터 방식. 쿼리 파라미터로도 가능)
async function deleteMenu(menuId) {
  try {
    // 클라이언트가 서버에게 데이터를 보내는 방식
    // 1. 쿼리 파라미터 방식: url 뒤에 붙여서 보낸다.
    //const url = "http://127.0.0.1:8000/menus?menuId=" + menuId; // ? 뒤에 변수를 붙인 것
    
    // 2. path 파라미터 방식: url 경로에 포함해서 보냅니다.
    const url = `http://127.0.0.1:8000/menus/${menuId}` // 변수명 없이 그냥 값만 붙인다. 이번에는 이 방법으로 하겠다. path 파라미터 방식
   
   // 3. request body: html 문서의 body 숨겨서 보낸다. addMenu() 함수에서 post 보내는 방식
    const re = await fetch(
      url,
      {
        method: "DELETE"
      }
    )
    if (!re.ok) throw new Error("메뉴 삭제 실패")
    //return re.json()  // 메뉴 추가 서비스는 호출위치로 리턴이 필수가 아니다
    return re.json()      // 필수는 아니지만 일반적으로 리턴을 하기도 합니다.
  } catch {
    console.log(error);
    alert("메뉴 삭제 중 오류 발생")
  }
}

// 어떻게 설계를 해야 하나?
// 팁: 요청이 뭐야? 메서드가 뭐야? 파라미터(넘길 데이터)가 있어?
// 수정은 바로 수정하는 것이 아님. 수정할 글을 먼저 가져와서 수정할 글을 보여주고
// 그 다음에 수정하도록 하고, 수정버튼을 누르면 실제 데이터가 수정이 된다.
// 예) 삭제는 삭제할 번호를 주면 바로 데이터 삭제. 수정과 다르다.
//  수정할 데이터를 가져오는 기능 추가, id값을 서버에게 보내서 서버가 한 개만 가져다 주는 코드
async function getMenuOne(id) {
  try {
    const url = `http://127.0.0.1:8000/menus/${id}`
    const re = await fetch(
      url,
      {
        method: "GET"
      }
    )
    if (!re.ok) throw new Error("글 불러오기 실패")
    return re.json()
  } catch {
    console.log(error);
    alert("글 불러오는 중 오류 발생")
  }
}

// 실제로 클라이언트에서 수정된 글을 서버에게 수정해달라고 수정해주세요 하는 요청
async function updateMenu(menuObject) {
  console.log(menuObject)
  try {
    const url = "http://127.0.0.1:8000/menus";
    const re = await fetch(
      url,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuObject)  // html의 body영역에 넣은 값
      }
    )
    if (!re.ok) throw new Error("메뉴 수정 실패")
    //return re.json()  // 메뉴 추가 서비스는 호출위치로 리턴이 필수가 아니다
    return re.json()      // 필수는 아니지만 일반적으로 리턴을 하기도 합니다.
  } catch (error){
    console.log(error);
    alert("메뉴 수정 중 오류 발생")
  }
}

// 추천 서비스
async function recommendMenu(id) {
  try{
    const url = `http://127.0.0.1:8000/menus/recommend/${id}`;
    const re = await fetch(
      url,
      {
        method: "POST"
      }
    )
    if(!re.ok) throw new Error("추천을 하지 못함")
    return re.json
  } catch (error) {
    console.log(error)
  }
}