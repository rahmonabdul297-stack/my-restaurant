import { toast } from "react-toastify"

export const successNotification=(message)=>{
    toast.success(message)
}
export const errorNotification=(message)=>{
    toast.error(message)
}
export const infoNotification=(message)=>{
    toast.info(message)
}

export const currencyFormatter = (amount) => {
  const fmt = new Intl.NumberFormat("NGN", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  });
  return fmt.format(amount);
};