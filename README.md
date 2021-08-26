파지상품 판매 사이트
======================
---
<img src="readme_Img/파지상품로그인화면.PNG" width="441px" alt="login"></img>  <img src="readme_Img/파지상품메인화면.PNG" width="400px" alt="login"></img><br/>
#### 서비스 소개
 농산물의 경우 모양이 이상하면 상품의 값어치가 떨어져 버려지는 경우가 많다. 
 이러한 상품들을 '파지 상품'이라고 합니다. 
 
해당 서비스를 통해 파지 상품을 판매하는 판매자와 이를 구매하는 소비자를 이어 주는 서비스로 판매자는 파지상품의 처리를 도와주고 소비자는 값싼 가격에 농산물을 구매할 수 있다는 장점이 있습니다.

#### 개발 인원
백엔드 - 2
프론트엔드 - 1
<br>
으로 구성되었으나 전체적인 UI설계, DB설계는 모든 팀원이 같이 진행하였습니다.

---------

### 1. 시스템 구성도



* 프론트로는 HTML, CSS, JS, Bootstrap, jQuery 등을 이용하여 개발
* 백엔드 서버로는 Node.js의 Express을 사용하여 개발
* 데이터베이스로는 AWS의 RDS 이용하여 MySQL 사용

### 2. 데이터베이스 설계

<img src="readme_Img/ERD.PNG" width="400px" alt="login"></img><br/>

### 3. 기능 소개
* 회원 관리    
-구매자 회원가입   
-공급업체 회원가입   
-로그인, 로그아웃

* 메인화면
-상품 검색   
-카테고리 분류 --> (최근 많이 팔린 상품, 마감임박 상품, 직거래 가능 등등)   
-카테고리별 등록순, 가격순, 리뷰 수 정렬 기능

* 상품상세화면      
-주문(개별주문, 장바구니추가)   
-해당업체즐겨찾기   
-리뷰 확인   

* 주문화면   
-즐겨찾기 업체 할인 적용 가능   
-쿠폰 보유시 쿠폰사용가능   
-같은지역에 있다면 직거래 or 배송 가능

* 구매자 마이페이지   
-보유 쿠폰정보 확인 가능   
-즐겨찾기 업체 목록   
-개인정보 확인 및 수정(카드정보, 배송지 정보)   
-주문목록 --> (리뷰 및 환불 기능)

* 공급업체 마이페이지   
-상품관리 (등록, 수정, 삭제)   
-주문관리(주문 상태 변경, 환불 목록)   
-월별 정산 확인

