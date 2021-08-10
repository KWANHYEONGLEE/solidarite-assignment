// * 문자열안에 영문,숫자가 포함 되어있는지 확인
export const IsIncludedNumberAndString = (compareString) => {
  const regExp = /^(?=.*[a-zA-z])(?=.*[0-9])/;
  if (regExp.test(compareString)) return true;
  else return false;
};
