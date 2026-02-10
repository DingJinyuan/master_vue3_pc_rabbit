import httpInstance from "@/utils/http";
/*
params: {
	orderState:0,
  page:1,
  pageSize:2
}
*/

export const getUserOrder = (params) => {
  return httpInstance({
    url: "/member/order",
    method: "GET",
    params,
    // 可选：覆盖全局超时，设为15秒（仅该接口生效）
    timeout: 15000,
  });
};
