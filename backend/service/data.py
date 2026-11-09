# 2026년 11월 9일 코드 수정
# menus.json 분리 > data.py 코드에서 menus.json 데이터 가져오는 코드 추가
# 작업자: 이현희

import json     # json 개념 정리하고 이거 사용하겠다
#import os       # os (operation system - 운영체제) 윈도우 자원을 사용하기 위한 소프트웨어

JSON_PATH = "./storage/menus_recommendation.json"

# json 파일 읽기
def load_menus():
    with open(JSON_PATH, "r", encoding="utf-8") as file:
        return json.load(file)

# json 파일 쓰기
def save_menus():
    with open(JSON_PATH, "w", encoding="utf-8") as file:
        return json.dump(menus, file, ensure_ascii=False, indent=4)

# 시작과 동시에 json 파일을 로드하여 menus 배열에 저장
menus = load_menus()

# load_menus()에서 일거온 id 중 최고값을 찾아서 하나 증가시킴
# 다음에 메뉴가 추가될 때의 id ㅏㄱㅄ
next_id = max((menu["id"] for menu in menus), default = 0) + 1

def get_all():
    return menus

# 메뉴 검색 서비스
def search(keyword):
    result = []                         # 빈 리스트 하나 추가
    for menu in menus:                  # menus 전체 리스트를 순회
        if keyword in menu['name']:     # menu 딕셔너리의 name 변수와 키워드가 같으면
            result.append(menu)         # 리스트에 추가해라
    return result                       # 리스트를 리턴

# 데이터 추가하는 함수
def add_menu(menu):
    menu = menu.model_dump()        ## 객체를 딕셔너리로 변경
    ## 전역변수에 있는 next_id 변수를 이 함수 내부에서 사용할게요. 라는 코드 추가
    global next_id  ## 이 코드는 전역변수에 있는 next_id 변수를 이 함수에서 사용하겠다.
    
    new_menu = {
        "id": next_id,
        "name": menu["name"],
        "calories":menu["calories"],
        "description":menu['description']
    }
    menus.append(new_menu)
    save_menus()    # menus의 내용이 변경되었으니 json 파일도 변경되어야 함
    next_id += 1
    
    return new_menu

# id로 데이터 삭제하는 함수
def delete_menu(menu_id):                        # enumerate 이 함수를 사용하면 인덱스와 값을 가져올 수 있다.
    for index, menu in enumerate(menus):    # 삭제할 데이터를 찾을 때는 id로 찾고
                                            # 리스트에서 지울 때는 인덱스 번호로 지운다.
                                            # 그래서 리스트 번호와 메뉴의 정보인 값이 모두 필요함
        if menu["id"] == menu_id:   # 삭제할 메뉴
            menus.pop(index)
            return menu_id          # 삭제가 되었다면 삭제한 아이디를 리턴
    return None                     # 삭제한 데이터가 없다면 None 리턴

# id로 데이터를 검색하는 함수
def get_one(id):
    for menu in menus:
        if(menu["id"] == id):
            return menu
    return None

# 클라이언트가 보낸 수정할 데이터로 실제 데이터를 수정하는 코드
def update_one(menudata): # 객체로 받는다.
    for menu in menus:
        #menu 변수는 딕셔너리이고, menudata는 클래스 객체라서 변수 접근 방식이 다름
        if(menu["id"] == menudata.id):
            menu["name"] = menudata.name
            menu["calories"] = menudata.calories
            menu["description"] = menudata.description
            save_menus()
            return menu
    return None

# 추천 수 증가
def update_recommend(id):
    for menu in menus:
        if(menu["id"] == id):
            menu["recommendation"] += 1
            save_menus()
            return
    return None
