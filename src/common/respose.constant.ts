export const MsgTypeMap = {
  duplication: 'duplication',
  doNotExist: 'do not exist',
  notMatch: 'do not match',
  unAuthorized: 'unAuthorized user',
  canCreate: 'can Create',
  maxLengthLimit: 'is too long',
};

//* 200번대 : 성공
export const OK = 200; //? 단순 리소스 리턴
export const OKStr = 'OK';
export const Created = 201; //? 생성 요청에 따른 처리 결과 리턴
export const CreatedStr = 'Created';
export const NoContent = 204; //? 정상 수행 되었지만 리턴할 결과가 없음
export const NoContentStr = 'NoContent';

//* 300번대 : 추가 행동 요청
export const MovedPermamently = 301; //? 페이지 경로 영구 변경. 리다이렉트, 해당 요청에는 항상 header 에 Location 값이 들어가야함
export const MovedTemporary = 302; //? 페이지 일시 이동, 리다이렉ㅌ, 해당 요청에는 항상 header 에 Location 값이 들어가야함
export const NotModifed = 304; //? 캐시요청시 리소스가 수정되지 않음, Body에 컨텐츠가 포함되면 안됨

//* 400번대 : 클라이언트 오류
export const BadRequest = 400; //? 잘못된 요청을 보냄, 필요한 구문, 메시지가 없을 경우
export const BadRequestStr = `BadRequest`;
export const Unauthorized = 401; //? 해당 리소스를 사용하려면 인증이 필요함. 헤더에 WWW-Authenticate 헤더와 함께 인증 절차 설명
export const UnauthorizedStr = 'Unauthorized';
export const Fobidden = 403; //? 요청은 정상적으로 이해 했지만, 서버에서 거절한 경우
export const FobiddenStr = 'Fobidden';
export const NotFound = 404; //? 해당 요청에 대한 리소스를 찾을수 없음.
export const NotFoundStr = 'NotFound';
export const Conflict = 409; //? 디비 처리에 의해서 충돌이 났음. 보통 중복 처리가 많이 발생함
export const ConflictStr = 'Conflict';

//* 500번대 : 서버 오류
export const ServerError = 500; //? 서버 문제로  발생, 애매한거 다 넣기.
export const ServerErrorStr = 'Internal Server Error';

//* 기본 리스폰 구조 생성
export const createResData = (status, data?, err?, msg?) => {
  const resData = { statusCode: status };
  if (err) resData['error'] = err;
  if (msg) resData['message'] = msg;
  if (data) resData['data'] = data;

  return resData;
};

//* 메시지 종류
export const createMassage = (type, param) => {
  return `${param} is ${type}`;
};
