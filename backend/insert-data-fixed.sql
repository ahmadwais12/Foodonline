USE online_resturant;

-- -----------------------------------------------------
-- USERS (10) - Fixed: Added password hashing placeholder and removed duplicate IDs
-- -----------------------------------------------------
INSERT INTO users (id, email, password, username, avatar_url, role)
VALUES
(1,'ahmad.wais@example.com','$2a$10$dummyhashforpassword123','Ahmad Wais',NULL,'customer'),
(2,'maria.jackson@example.com','$2a$10$dummyhashforpassword123','Maria Jackson',NULL,'customer'),
(3,'farid.noori@example.com','$2a$10$dummyhashforpassword123','Farid Noori',NULL,'customer'),
(4,'john.smith@example.com','$2a$10$dummyhashforpassword123','John Smith',NULL,'customer'),
(5,'zahra.karimi@example.com','$2a$10$dummyhashforpassword123','Zahra Karimi',NULL,'customer'),
(6,'driver.ali@example.com','$2a$10$dummyhashforpassword123','Ali Hamidi',NULL,'driver'),
(7,'driver.leo@example.com','$2a$10$dummyhashforpassword123','Leo Walker',NULL,'driver'),
(8,'admin@example.com','$2a$10$dummyhashforpassword123','System Admin',NULL,'admin'),
(9,'sara.rahimi@example.com','$2a$10$dummyhashforpassword123','Sara Rahimi',NULL,'customer'),
(10,'michael.lee@example.com','$2a$10$dummyhashforpassword123','Michael Lee',NULL,'customer');

-- -----------------------------------------------------
-- ROLES (10)
-- -----------------------------------------------------
INSERT INTO roles (id, name, description)
VALUES
(1,'customer','Regular user'),
(2,'admin','Platform administrator'),
(3,'driver','Delivery driver'),
(4,'restaurant_owner','Restaurant owner'),
(5,'staff','Restaurant staff'),
(6,'manager','System manager'),
(7,'support','Customer support staff'),
(8,'vendor','External vendor'),
(9,'guest','Temporary guest account'),
(10,'superadmin','Root level admin');

-- -----------------------------------------------------
-- CATEGORIES (10) - Fixed: Added display_order column
-- -----------------------------------------------------
INSERT INTO categories (id, name, slug, image_url, display_order)
VALUES
(1,'Pizza','pizza',NULL,1),
(2,'Burgers','burgers',NULL,2),
(3,'Drinks','drinks',NULL,3),
(4,'Desserts','desserts',NULL,4),
(5,'Sandwiches','sandwiches',NULL,5),
(6,'Afghan Food','afghan-food',NULL,6),
(7,'Indian Food','indian-food',NULL,7),
(8,'Fast Food','fast-food',NULL,8),
(9,'Salads','salads',NULL,9),
(10,'Chicken Meals','chicken-meals',NULL,10);

-- -----------------------------------------------------
-- RESTAURANTS (10) - Fixed: All columns match schema
-- -----------------------------------------------------
INSERT INTO restaurants (id, name, slug, description, image_url, cover_image_url, category_id, rating, total_reviews, delivery_time, delivery_fee, min_order, is_active, address, phone)
VALUES
(1,'Kabul Darbar','kabul-darbar','Traditional Afghan dishes',NULL,NULL,6,4.70,310,'30-40 min',2.00,5.00,1,'Shar-e-Naw, Kabul','070000001'),
(2,'Pizza World','pizza-world','Italian & American style pizzas',NULL,NULL,1,4.40,210,'25-35 min',2.00,6.00,1,'Karte 4, Kabul','070000002'),
(3,'Burger Haven','burger-haven','Smash burgers & fries',NULL,NULL,2,4.30,180,'20-30 min',1.00,5.00,1,'City Center','070000003'),
(4,'Herat Saffron House','herat-saffron','Authentic Herati cuisine',NULL,NULL,6,4.80,260,'35-45 min',2.00,7.00,1,'Dehbori, Kabul','070000004'),
(5,'Tokyo Sushi Bar','tokyo-sushi','Japanese sushi sets & bowls',NULL,NULL,9,4.60,140,'30-40 min',3.00,10.00,1,'Makroyan 1','070000005'),
(6,'Indian Spice Kitchen','indian-spice','Indian curries & naan',NULL,NULL,7,4.50,190,'25-35 min',2.00,6.00,1,'Taimani','070000006'),
(7,'Fresh Smoothies','fresh-smoothies','Natural juices & smoothies',NULL,NULL,3,4.90,150,'20-25 min',1.00,5.00,1,'Shar-e-Naw','070000007'),
(8,'Fast Bite','fast-bite','Quick snacks & fast meals',NULL,NULL,8,4.10,90,'15-25 min',1.00,4.00,1,'City Mall','070000008'),
(9,'Healthy Salads','healthy-salads','Healthy bowls & salads',NULL,NULL,9,4.80,110,'20-30 min',1.00,6.00,1,'Karte 3','070000009'),
(10,'Chicken Express','chicken-express','Grilled & crispy chicken',NULL,NULL,10,4.20,170,'25-35 min',2.00,5.00,1,'Shahrara','070000010');

-- -----------------------------------------------------
-- RESTAURANT BRANCHES (10) - Fixed: Added latitude/longitude as NULL
-- -----------------------------------------------------
INSERT INTO restaurant_branches (id, restaurant_id, name, address, latitude, longitude)
VALUES
(1,1,'Kabul Darbar - Branch A','Shar-e-Naw Street',NULL,NULL),
(2,2,'Pizza World - Branch A','Karte 4',NULL,NULL),
(3,3,'Burger Haven - Branch A','Downtown',NULL,NULL),
(4,4,'Herat Saffron House - Branch A','Dehbori',NULL,NULL),
(5,5,'Tokyo Sushi - Branch A','Makroyan',NULL,NULL),
(6,6,'Indian Spice - Branch A','Taimani',NULL,NULL),
(7,7,'Fresh Smoothies - Branch A','Shar-e-Naw',NULL,NULL),
(8,8,'Fast Bite - Branch A','City Mall',NULL,NULL),
(9,9,'Healthy Salads - Branch A','Karte 3',NULL,NULL),
(10,10,'Chicken Express - Branch A','Shahrara',NULL,NULL);

-- -----------------------------------------------------
-- MENU ITEMS (10) - Fixed: Added is_vegetarian and is_available columns
-- -----------------------------------------------------
INSERT INTO menu_items (id, restaurant_id, name, description, price, image_url, category, is_vegetarian, is_available)
VALUES
(1,1,'Kabuli Pulao','Rice with raisins & lamb',6.00,NULL,'Afghan',FALSE,TRUE),
(2,2,'Pepperoni Pizza','Beef pepperoni with cheese',10.00,NULL,'Pizza',FALSE,TRUE),
(3,3,'Double Cheese Burger','Smash beef patty with cheese',7.00,NULL,'Burger',FALSE,TRUE),
(4,4,'Manto','Afghan dumplings',5.00,NULL,'Afghan',FALSE,TRUE),
(5,5,'California Sushi Roll','Sushi with crab & avocado',12.00,NULL,'Sushi',FALSE,TRUE),
(6,6,'Butter Chicken','Creamy Indian curry',9.00,NULL,'Indian',FALSE,TRUE),
(7,7,'Strawberry Smoothie','Fresh blended strawberries',3.00,NULL,'Drinks',FALSE,TRUE),
(8,8,'Zinger Burger','Crispy spicy chicken burger',5.00,NULL,'Fast Food',FALSE,TRUE),
(9,9,'Greek Salad','Feta cheese & olives salad',4.00,NULL,'Salad',TRUE,TRUE),
(10,10,'Grilled Chicken Meal','Served with rice & salad',8.00,NULL,'Chicken',FALSE,TRUE);

-- -----------------------------------------------------
-- MENU ITEM OPTIONS (10) - Fixed: Added is_required column
-- -----------------------------------------------------
INSERT INTO menu_item_options (id, menu_item_id, name, price, is_required)
VALUES
(1,1,'Extra Meat',2.00,FALSE),
(2,2,'Extra Cheese',1.00,FALSE),
(3,3,'Double Patty',2.00,FALSE),
(4,4,'Extra Yogurt',0.50,FALSE),
(5,5,'Large Size',3.00,FALSE),
(6,6,'Extra Sauce',1.00,FALSE),
(7,7,'Honey Add-on',0.50,FALSE),
(8,8,'Extra Spicy',0.00,FALSE),
(9,9,'Add Chicken',2.00,FALSE),
(10,10,'Extra Rice',1.00,FALSE);

-- -----------------------------------------------------
-- CARTS (10)
-- -----------------------------------------------------
INSERT INTO cart (id, user_id, restaurant_id)
VALUES
(1,1,1),
(2,2,2),
(3,3,3),
(4,4,4),
(5,5,5),
(6,6,6),
(7,7,7),
(8,8,8),
(9,9,9),
(10,10,10);

-- -----------------------------------------------------
-- CART ITEMS (10)
-- -----------------------------------------------------
INSERT INTO cart_items (id, cart_id, menu_item_id, quantity, special_instructions)
VALUES
(1,1,1,1,NULL),
(2,2,2,2,NULL),
(3,3,3,1,NULL),
(4,4,4,3,NULL),
(5,5,5,1,NULL),
(6,6,6,1,NULL),
(7,7,7,2,NULL),
(8,8,8,1,NULL),
(9,9,9,2,NULL),
(10,10,10,1,NULL);

-- -----------------------------------------------------
-- DELIVERY DRIVERS (10) - Fixed before ORDERS (FK constraint)
-- -----------------------------------------------------
INSERT INTO delivery_drivers (id, user_id, license_number, vehicle_type, vehicle_plate, is_active)
VALUES
(1,6,'AFG-001','Bike','B001',TRUE),
(2,7,'AFG-002','Bike','B002',TRUE),
(3,1,'AFG-003','Car','C003',TRUE),
(4,2,'AFG-004','Car','C004',TRUE),
(5,3,'AFG-005','Bike','B005',TRUE),
(6,4,'AFG-006','Bike','B006',TRUE),
(7,5,'AFG-007','Car','C007',TRUE),
(8,8,'AFG-008','Bike','B008',TRUE),
(9,9,'AFG-009','Bike','B009',TRUE),
(10,10,'AFG-010','Car','C010',TRUE);

-- -----------------------------------------------------
-- ORDERS (10) - Fixed: delivery_address as JSON, added driver_id
-- -----------------------------------------------------
INSERT INTO orders (id, order_number, user_id, restaurant_id, delivery_address,
subtotal, delivery_fee, tax, discount, total, status, payment_status, driver_id)
VALUES
(1,'ORD1001',1,1,'{"street":"Shar-e-Naw","city":"Kabul"}',12.00,2.00,1.00,0.00,15.00,'pending','pending',NULL),
(2,'ORD1002',2,2,'{"street":"Karte 4","city":"Kabul"}',20.00,2.00,1.00,0.00,23.00,'confirmed','paid',1),
(3,'ORD1003',3,3,'{"street":"Downtown","city":"Kabul"}',14.00,1.00,1.00,0.00,16.00,'delivered','paid',2),
(4,'ORD1004',4,4,'{"street":"Dehbori","city":"Kabul"}',10.00,2.00,1.00,0.00,13.00,'pending','pending',NULL),
(5,'ORD1005',5,5,'{"street":"Makroyan","city":"Kabul"}',24.00,3.00,2.00,0.00,29.00,'preparing','paid',3),
(6,'ORD1006',6,6,'{"street":"Taimani","city":"Kabul"}',18.00,2.00,1.00,0.00,21.00,'ready','paid',4),
(7,'ORD1007',7,7,'{"street":"Shar-e-Naw","city":"Kabul"}',9.00,1.00,1.00,0.00,11.00,'out_for_delivery','paid',5),
(8,'ORD1008',8,8,'{"street":"City Mall","city":"Kabul"}',15.00,2.00,1.00,0.00,18.00,'cancelled','refunded',NULL),
(9,'ORD1009',9,9,'{"street":"Karte 3","city":"Kabul"}',11.00,1.00,1.00,0.00,13.00,'delivered','paid',6),
(10,'ORD1010',10,10,'{"street":"Shahrara","city":"Kabul"}',16.00,2.00,1.00,0.00,19.00,'preparing','pending',NULL);

-- -----------------------------------------------------
-- ORDER ITEMS (10)
-- -----------------------------------------------------
INSERT INTO order_items (id, order_id, menu_item_id, item_name, item_price, quantity, special_instructions)
VALUES
(1,1,1,'Kabuli Pulao',6.00,2,NULL),
(2,2,2,'Pepperoni Pizza',10.00,2,NULL),
(3,3,3,'Double Cheese Burger',7.00,2,NULL),
(4,4,4,'Manto',5.00,2,NULL),
(5,5,5,'California Sushi Roll',12.00,2,NULL),
(6,6,6,'Butter Chicken',9.00,1,NULL),
(7,7,7,'Strawberry Smoothie',3.00,3,NULL),
(8,8,8,'Zinger Burger',5.00,1,NULL),
(9,9,9,'Greek Salad',4.00,2,NULL),
(10,10,10,'Grilled Chicken Meal',8.00,2,NULL);

-- -----------------------------------------------------
-- ORDER STATUS LOG (10)
-- -----------------------------------------------------
INSERT INTO order_status_log (id, order_id, status)
VALUES
(1,1,'pending'),
(2,2,'confirmed'),
(3,3,'delivered'),
(4,4,'pending'),
(5,5,'preparing'),
(6,6,'ready'),
(7,7,'out_for_delivery'),
(8,8,'cancelled'),
(9,9,'delivered'),
(10,10,'preparing');

-- -----------------------------------------------------
-- USER ADDRESSES (10) - Fixed: Added state, postal_code, lat/lng as NULL
-- -----------------------------------------------------
INSERT INTO user_addresses (id, user_id, label, address_line1, city, state, postal_code, latitude, longitude, is_default)
VALUES
(1,1,'Home','Shar-e-Naw','Kabul',NULL,NULL,NULL,NULL,TRUE),
(2,2,'Home','Karte 4','Kabul',NULL,NULL,NULL,NULL,TRUE),
(3,3,'Home','Taimani','Kabul',NULL,NULL,NULL,NULL,TRUE),
(4,4,'Home','Dehbori','Kabul',NULL,NULL,NULL,NULL,TRUE),
(5,5,'Home','Makroyan','Kabul',NULL,NULL,NULL,NULL,TRUE),
(6,6,'Home','Karte 3','Kabul',NULL,NULL,NULL,NULL,TRUE),
(7,7,'Home','Pol-e-Surkh','Kabul',NULL,NULL,NULL,NULL,TRUE),
(8,8,'Home','Shahrara','Kabul',NULL,NULL,NULL,NULL,TRUE),
(9,9,'Home','Wazir Akbar Khan','Kabul',NULL,NULL,NULL,NULL,TRUE),
(10,10,'Home','Karte Naw','Kabul',NULL,NULL,NULL,NULL,TRUE);

-- -----------------------------------------------------
-- DRIVER LOCATIONS (10)
-- -----------------------------------------------------
INSERT INTO driver_locations (id, driver_id, latitude, longitude)
VALUES
(1,1,34.5100,69.1100),
(2,2,34.5200,69.1200),
(3,3,34.5300,69.1300),
(4,4,34.5400,69.1400),
(5,5,34.5500,69.1500),
(6,6,34.5600,69.1600),
(7,7,34.5700,69.1700),
(8,8,34.5800,69.1800),
(9,9,34.5900,69.1900),
(10,10,34.6000,69.2000);

-- -----------------------------------------------------
-- PAYMENTS (10)
-- -----------------------------------------------------
INSERT INTO payments (id, order_id, amount, payment_method, transaction_id, status)
VALUES
(1,1,15.00,'cash',NULL,'pending'),
(2,2,23.00,'card','TX1002','completed'),
(3,3,16.00,'cash',NULL,'completed'),
(4,4,13.00,'cash',NULL,'pending'),
(5,5,29.00,'card','TX1005','completed'),
(6,6,21.00,'card','TX1006','completed'),
(7,7,11.00,'cash',NULL,'completed'),
(8,8,18.00,'card','TX1008','failed'),
(9,9,13.00,'cash',NULL,'completed'),
(10,10,19.00,'card',NULL,'pending');

-- -----------------------------------------------------
-- PAYMENT TRANSACTIONS (10)
-- -----------------------------------------------------
INSERT INTO payment_transactions (id, payment_id, transaction_id, amount, status, gateway_response)
VALUES
(1,1,'TX1001',15.00,'pending',NULL),
(2,2,'TX1002',23.00,'completed',NULL),
(3,3,'TX1003',16.00,'completed',NULL),
(4,4,'TX1004',13.00,'pending',NULL),
(5,5,'TX1005',29.00,'completed',NULL),
(6,6,'TX1006',21.00,'completed',NULL),
(7,7,'TX1007',11.00,'completed',NULL),
(8,8,'TX1008',18.00,'failed',NULL),
(9,9,'TX1009',13.00,'completed',NULL),
(10,10,'TX1010',19.00,'pending',NULL);

-- -----------------------------------------------------
-- COUPONS (10) - Fixed: valid_from and valid_until as TIMESTAMP
-- -----------------------------------------------------
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, valid_from, valid_until, usage_limit, used_count, is_active)
VALUES
(1,'AFG10','10% off Afghan dishes','percentage',10.00,10.00,30.00,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),NULL,0,TRUE),
(2,'PIZZA20','20% off Pizza World','percentage',20.00,15.00,40.00,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),NULL,0,TRUE),
(3,'FIRST50','50 AFN first order','fixed',50.00,10.00,50.00,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),NULL,0,TRUE),
(4,'SUSHI15','15% off Sushi','percentage',15.00,20.00,40.00,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),NULL,0,TRUE),
(5,'FAST5','5% off Fast Bite','percentage',5.00,5.00,20.00,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),NULL,0,TRUE),
(6,'DRINKS2','2 AFN off any drink','fixed',2.00,0.00,10.00,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),NULL,0,TRUE),
(7,'INDIAN25','25% off Indian Spice','percentage',25.00,25.00,60.00,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),NULL,0,TRUE),
(8,'HOLIDAY30','30% Holiday discount','percentage',30.00,20.00,50.00,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),NULL,0,TRUE),
(9,'SALAD10','10% off salads','percentage',10.00,5.00,15.00,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),NULL,0,TRUE),
(10,'CHICKEN10','10 AFN off chicken meals','fixed',10.00,10.00,25.00,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),NULL,0,TRUE);

-- -----------------------------------------------------
-- APPLIED COUPONS (10)
-- -----------------------------------------------------
INSERT INTO applied_coupons (id, coupon_id, order_id, user_id, discount_amount)
VALUES
(1,1,1,1,2.00),
(2,2,2,2,4.00),
(3,3,3,3,5.00),
(4,4,4,4,3.00),
(5,5,5,5,1.00),
(6,6,6,6,2.00),
(7,7,7,7,4.00),
(8,8,8,8,5.00),
(9,9,9,9,1.00),
(10,10,10,10,3.00);

-- -----------------------------------------------------
-- REVIEWS (10) - Fixed: Removed CHECK constraint issue
-- -----------------------------------------------------
INSERT INTO reviews (id, user_id, restaurant_id, order_id, rating, comment)
VALUES
(1,1,1,NULL,5,'Amazing Afghan food!'),
(2,2,2,NULL,4,'Pizza was delicious.'),
(3,3,3,NULL,5,'Best burger I ever had.'),
(4,4,4,NULL,4,'Very tasty and traditional.'),
(5,5,5,NULL,5,'Fresh sushi and clean quality.'),
(6,6,6,NULL,4,'Good Indian curry.'),
(7,7,7,NULL,5,'Smoothies were fresh!'),
(8,8,8,NULL,3,'Fast but average taste.'),
(9,9,9,NULL,5,'Healthy and refreshing.'),
(10,10,10,NULL,4,'Chicken was juicy.');

-- -----------------------------------------------------
-- USER FAVORITES (10)
-- -----------------------------------------------------
INSERT INTO user_favorites (id, user_id, restaurant_id)
VALUES
(1,1,1),
(2,2,2),
(3,3,3),
(4,4,4),
(5,5,5),
(6,6,6),
(7,7,7),
(8,8,8),
(9,9,9),
(10,10,10);

-- -----------------------------------------------------
-- NOTIFICATIONS (10)
-- -----------------------------------------------------
INSERT INTO notifications (id, user_id, title, message, type, is_read)
VALUES
(1,1,'Order Placed','Your Kabul Darbar order is placed','order',FALSE),
(2,2,'Order Confirmed','Your pizza is being prepared','order',FALSE),
(3,3,'Promo','Burger Haven 15% off today','promotion',FALSE),
(4,4,'Order Update','Your order is being cooked','order',FALSE),
(5,5,'Sushi Promo','Tokyo Sushi 10% off for members','promotion',FALSE),
(6,6,'Delivery Update','Driver is on the way','delivery',FALSE),
(7,7,'System Notice','Security update applied','system',TRUE),
(8,8,'Promotion','Fast Bite Buy 1 Get 1 Free','promotion',FALSE),
(9,9,'Order Delivered','Your salad is delivered','order',TRUE),
(10,10,'Holiday Promo','Special 20% discount this week','promotion',FALSE);

-- -----------------------------------------------------
-- SETTINGS (10)
-- -----------------------------------------------------
INSERT INTO settings (id, key_name, value, description)
VALUES
(1,'site_name','Online Food Delivery','Website name'),
(2,'currency','AFN','Base currency'),
(3,'timezone','Asia/Kabul','Server timezone'),
(4,'support_email','support@foodapp.com','Customer support email'),
(5,'min_order','5','Minimum order amount'),
(6,'max_order','5000','Maximum order amount'),
(7,'delivery_radius_km','10','Delivery radius in kilometers'),
(8,'tax_rate','5','Tax rate percentage'),
(9,'maintenance_mode','off','Maintenance mode status'),
(10,'version','1.0.0','Application version');

-- -----------------------------------------------------
-- REFRESH TOKENS (10) - Fixed: expires_at as proper timestamp
-- -----------------------------------------------------
INSERT INTO refresh_tokens (id, user_id, token, expires_at)
VALUES
(1,1,'tkn_001',DATE_ADD(NOW(),INTERVAL 7 DAY)),
(2,2,'tkn_002',DATE_ADD(NOW(),INTERVAL 7 DAY)),
(3,3,'tkn_003',DATE_ADD(NOW(),INTERVAL 7 DAY)),
(4,4,'tkn_004',DATE_ADD(NOW(),INTERVAL 7 DAY)),
(5,5,'tkn_005',DATE_ADD(NOW(),INTERVAL 7 DAY)),
(6,6,'tkn_006',DATE_ADD(NOW(),INTERVAL 7 DAY)),
(7,7,'tkn_007',DATE_ADD(NOW(),INTERVAL 7 DAY)),
(8,8,'tkn_008',DATE_ADD(NOW(),INTERVAL 7 DAY)),
(9,9,'tkn_009',DATE_ADD(NOW(),INTERVAL 7 DAY)),
(10,10,'tkn_010',DATE_ADD(NOW(),INTERVAL 7 DAY));
