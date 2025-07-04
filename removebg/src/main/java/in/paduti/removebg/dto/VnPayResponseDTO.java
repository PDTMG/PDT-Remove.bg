package in.paduti.removebg.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VnPayResponseDTO {
    private String vnp_TxnRef; // Mã đơn hàng
    private String vnp_Amount; // Số tiền (VND * 100)
    private String vnp_ResponseCode; // Mã phản hồi ("00" là thành công)
    private String vnp_TransactionStatus; // Trạng thái giao dịch
    private String vnp_TransactionNo; // Mã giao dịch VNPAY
    private String vnp_BankCode; // Mã ngân hàng
    private String vnp_PayDate; // Ngày thanh toán
    private String vnp_SecureHash; // Chữ ký bảo mật

}
