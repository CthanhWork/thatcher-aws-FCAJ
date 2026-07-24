---
title: "Amazon S3 Storage Classes"
weight: 3
summary: "Khảo sát các lớp lưu trữ Amazon S3 và tiêu chí lựa chọn theo tần suất truy cập, độ trễ, tính sẵn sàng và chi phí."
chapter: false
---

## Bài Viết Đã Đăng

[Xem bài đăng gốc trong cộng đồng AWS Study Group - First Cloud Journey](https://www.facebook.com/groups/awsstudygroupfcj/permalink/2206292006802426/)

## Khảo Sát Các Lớp Lưu Trữ Trong Amazon S3 Và Tiêu Chí Lựa Chọn

Amazon S3 là một trong những dịch vụ lưu trữ dữ liệu phổ biến nhất của AWS. Dịch vụ cung cấp khả năng lưu trữ gần như không giới hạn, độ bền dữ liệu lên đến 99,999999999% và khả năng mở rộng linh hoạt.

Thay vì chỉ có một hình thức lưu trữ, Amazon S3 cung cấp nhiều **Storage Classes** để đáp ứng các nhu cầu khác nhau về tần suất truy cập, hiệu năng, thời gian lưu trữ và chi phí.

## Tổng Quan Các Lớp Lưu Trữ

### S3 Standard

S3 Standard phù hợp với dữ liệu được truy cập thường xuyên và yêu cầu độ trễ thấp, chẳng hạn như website tĩnh, ứng dụng web, ứng dụng di động, hình ảnh và video. Dữ liệu được lưu trên nhiều Availability Zone để tăng khả năng chịu lỗi, nhưng chi phí lưu trữ cao hơn các lớp dành cho dữ liệu ít truy cập.

### S3 Intelligent-Tiering

S3 Intelligent-Tiering phù hợp khi tần suất truy cập khó dự đoán. Dịch vụ tự động chuyển đối tượng giữa các tầng truy cập dựa trên mức độ sử dụng mà không cần người dùng can thiệp.

Lớp này phù hợp với kho dữ liệu doanh nghiệp, tài liệu dự án và nội dung có tần suất truy cập thay đổi theo thời gian. Người dùng trả thêm phí giám sát đối tượng nhưng có thể giảm đáng kể tổng chi phí lưu trữ.

### S3 Standard-Infrequent Access

Standard-IA dành cho dữ liệu ít được truy cập nhưng vẫn cần truy xuất nhanh khi cần. Chi phí lưu trữ thấp hơn S3 Standard, nhưng có thêm phí truy xuất.

Trường hợp sử dụng phổ biến:

- Sao lưu dữ liệu.
- Hồ sơ lưu trữ.
- Dữ liệu dự phòng.
- Tài liệu chỉ sử dụng một vài lần trong năm.

### S3 One Zone-Infrequent Access

One Zone-IA chỉ lưu dữ liệu trong một Availability Zone nên có chi phí thấp hơn Standard-IA. Lớp này phù hợp với dữ liệu có thể tạo lại, file tạm, bản sao lưu thứ cấp hoặc nội dung không yêu cầu tính sẵn sàng cao.

### S3 Glacier Instant Retrieval

Glacier Instant Retrieval dành cho dữ liệu lưu trữ dài hạn nhưng vẫn cần truy xuất ngay với độ trễ mili giây. Một số trường hợp sử dụng gồm hồ sơ y tế, hình ảnh lưu trữ, nội dung đa phương tiện và dữ liệu pháp lý.

### S3 Glacier Flexible Retrieval

Glacier Flexible Retrieval phù hợp với dữ liệu lưu trữ lâu dài và không cần truy cập thường xuyên. Thời gian truy xuất có thể từ vài phút đến vài giờ, tùy mức chi phí và yêu cầu sử dụng.

### S3 Glacier Deep Archive

Glacier Deep Archive có chi phí lưu trữ thấp nhất trong Amazon S3. Lớp này dành cho dữ liệu cần lưu giữ nhiều năm và gần như không được truy cập, chẳng hạn như hồ sơ pháp lý, dữ liệu tuân thủ và bản sao lưu dài hạn.

## Tiêu Chí Lựa Chọn

### Tần Suất Truy Cập

Dữ liệu truy cập thường xuyên nên dùng S3 Standard. Khi tần suất khó dự đoán, Intelligent-Tiering là lựa chọn phù hợp. Dữ liệu chỉ truy cập vài lần mỗi tháng hoặc mỗi năm có thể dùng Standard-IA hoặc Glacier.

### Thời Gian Truy Xuất

Nếu ứng dụng yêu cầu phản hồi ngay, nên chọn Standard, Intelligent-Tiering hoặc Glacier Instant Retrieval. Nếu có thể chờ vài phút hoặc vài giờ, Glacier Flexible Retrieval và Deep Archive giúp giảm chi phí đáng kể.

### Chi Phí Lưu Trữ Và Truy Xuất

Lớp có chi phí lưu trữ thấp thường đi kèm phí truy xuất cao hơn hoặc thời gian lưu tối thiểu. Vì vậy cần đánh giá tổng chi phí trong toàn bộ vòng đời dữ liệu, không chỉ đơn giá lưu trữ.

### Tính Sẵn Sàng

Dữ liệu quan trọng nên được lưu trên nhiều Availability Zone bằng Standard hoặc Standard-IA. One Zone-IA phù hợp hơn với dữ liệu có thể tái tạo hoặc có bản sao ở nơi khác.

### Thời Gian Lưu Giữ

Dữ liệu ngắn hạn phù hợp với Standard hoặc Intelligent-Tiering. Dữ liệu cần lưu nhiều năm nhưng ít truy cập nên dùng Glacier Flexible Retrieval hoặc Glacier Deep Archive.

## Kết Luận

Amazon S3 không cung cấp một giải pháp chung cho mọi loại dữ liệu mà cho phép lựa chọn theo nhu cầu cụ thể. Hiểu rõ đặc điểm của từng Storage Class giúp xây dựng chiến lược lưu trữ hiệu quả, đảm bảo khả năng truy cập khi cần và tối ưu chi phí vận hành trên AWS.
