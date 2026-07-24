---
title: "Amazon Bedrock - Generative AI on AWS"
weight: 1
summary: "Tìm hiểu Amazon Bedrock, Foundation Models, Knowledge Bases, RAG và kiến trúc ứng dụng Generative AI trên AWS."
chapter: false
---

## Bài Viết Đã Đăng

[Xem bài đăng gốc trong cộng đồng AWS Study Group - First Cloud Journey](https://www.facebook.com/groups/awsstudygroupfcj/permalink/2201251410639819/)

## Amazon Bedrock - Dịch Vụ Generative AI Trên AWS

Trong thời gian gần đây, mình dành thời gian tìm hiểu các dịch vụ AI trên AWS, đặc biệt là **Amazon Bedrock**. Sau khi đọc tài liệu của AWS và xem qua một số ví dụ triển khai, mình nhận thấy đây là một dịch vụ hữu ích vì giúp việc xây dựng ứng dụng AI trở nên đơn giản hơn rất nhiều.

Điểm mình ấn tượng đầu tiên là Amazon Bedrock không yêu cầu người phát triển phải tự cài đặt hoặc quản lý hạ tầng AI. Thay vì phải chuẩn bị máy chủ GPU, cài đặt framework và triển khai mô hình ngôn ngữ lớn, AWS cung cấp sẵn nhiều mô hình AI từ các nhà cung cấp khác nhau trên cùng một nền tảng. Người dùng chỉ cần gửi prompt thông qua API để nhận kết quả từ mô hình.

## Luồng Xử Lý Của Ứng Dụng

Một ứng dụng AI sử dụng Amazon Bedrock có thể hoạt động theo luồng sau:

1. Người dùng gửi yêu cầu từ website hoặc ứng dụng di động.
2. Amazon API Gateway tiếp nhận request và chuyển đến AWS Lambda.
3. Lambda kiểm tra dữ liệu đầu vào, xử lý nghiệp vụ và xây dựng prompt phù hợp.
4. Lambda gửi yêu cầu đến Amazon Bedrock để mô hình AI xử lý.
5. Khi cần bổ sung dữ liệu, Lambda có thể đọc tài liệu từ Amazon S3 hoặc truy xuất dữ liệu từ Amazon DynamoDB.
6. Kết quả cuối cùng được trả về cho người dùng thông qua API Gateway.

## Foundation Models

Amazon Bedrock không chỉ hỗ trợ một mô hình duy nhất mà cung cấp quyền truy cập đến nhiều **Foundation Models** của các nhà cung cấp khác nhau, chẳng hạn như:

- Amazon Titan
- Anthropic Claude
- Meta Llama
- Cohere
- Mistral AI

Nhờ đó, nhà phát triển có thể thử nghiệm và lựa chọn mô hình phù hợp với từng bài toán mà không phải thay đổi toàn bộ kiến trúc hệ thống.

## Knowledge Bases Và RAG

Bedrock hỗ trợ kết hợp với **Knowledge Bases** để xây dựng ứng dụng theo mô hình **Retrieval-Augmented Generation (RAG)**. Thay vì chỉ dựa trên kiến thức đã được huấn luyện sẵn, AI có thể truy xuất tài liệu của doanh nghiệp hoặc dữ liệu lưu trong Amazon S3 trước khi tạo câu trả lời.

Cách tiếp cận này giúp kết quả chính xác, cập nhật và phù hợp với ngữ cảnh hơn. Một số ứng dụng tiêu biểu gồm:

- Chatbot nội bộ
- Trợ lý tra cứu tài liệu
- Hệ thống hỏi đáp theo dữ liệu doanh nghiệp
- Trợ lý hỗ trợ khách hàng

## Giám Sát Với Amazon CloudWatch

Amazon CloudWatch không trực tiếp xử lý dữ liệu AI nhưng đóng vai trò giám sát toàn bộ hệ thống. CloudWatch thu thập log, metrics và cảnh báo từ API Gateway, Lambda, Bedrock, S3 hoặc DynamoDB, giúp quản trị viên:

- Theo dõi hiệu suất và độ trễ.
- Phát hiện lỗi trong quá trình xử lý.
- Thiết lập cảnh báo khi hệ thống có dấu hiệu bất thường.
- Phân tích hoạt động của ứng dụng theo thời gian.

## Nhận Xét

Qua quá trình tìm hiểu, mình nhận thấy kiến trúc AWS được thiết kế theo hướng tách biệt từng thành phần. Mỗi dịch vụ đảm nhiệm một vai trò riêng nên hệ thống dễ mở rộng, dễ bảo trì và có thể thay đổi từng thành phần mà không ảnh hưởng đến toàn bộ ứng dụng.

Trong thời gian tới, mình muốn tiếp tục nghiên cứu:

- Amazon Bedrock Agents.
- Knowledge Bases và mô hình RAG.
- Prompt Engineering trên AWS.
- Tích hợp Bedrock với Lambda và API Gateway.
- So sánh Claude, Titan và Llama trong các bài toán thực tế.

Bài viết là phần tổng hợp kiến thức trong quá trình học. Mình mong nhận được thêm góp ý và kinh nghiệm thực tế từ cộng đồng để tiếp tục hoàn thiện kiến thức về Generative AI trên AWS.
