import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.category.deleteMany();
  await prisma.shop.deleteMany();

  const [burgers, drinks, desserts, healthy, pizza] = await Promise.all([
    prisma.category.create({ data: { name: 'Burgers' } }),
    prisma.category.create({ data: { name: 'Drinks' } }),
    prisma.category.create({ data: { name: 'Desserts' } }),
    prisma.category.create({ data: { name: 'Healthy' } }),
    prisma.category.create({ data: { name: 'Pizza' } }),
  ]);

  const shops = await Promise.all([
    prisma.shop.create({ data: { name: 'Burger Hub', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' } }),
    prisma.shop.create({ data: { name: 'Pizza Town', rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' } }),
    prisma.shop.create({ data: { name: 'Green Bowl', rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400' } }),
    prisma.shop.create({ data: { name: 'Street Wok', rating: 3.8, imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400' } }),
    prisma.shop.create({ data: { name: 'Taco Point', rating: 3.3, imageUrl: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=400' } }),
    prisma.shop.create({ data: { name: 'Budget Bites', rating: 2.9, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' } }),
    prisma.shop.create({ data: { name: 'Night Snacks', rating: 2.4, imageUrl: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400' } }),
  ]);

  const [burgerHub, pizzaTown, greenBowl, streetWok, tacoPoint, budgetBites, nightSnacks] = shops;

  await prisma.product.createMany({
    data: [
      { name: 'Classic Burger', price: 9.99, discountPercent: 10, shopId: burgerHub.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
      { name: 'BBQ Burger', price: 12.49, shopId: burgerHub.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400' },
      { name: 'Fries', price: 3.99, shopId: burgerHub.id, categoryId: drinks.id, imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400' },
      { name: 'Pepperoni Pizza', price: 14.99, shopId: pizzaTown.id, categoryId: pizza.id, imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400' },
      { name: 'Margarita Pizza', price: 13.49, discountPercent: 15, shopId: pizzaTown.id, categoryId: pizza.id, imageUrl: 'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?w=400' },
      { name: 'Tiramisu', price: 5.49, shopId: pizzaTown.id, categoryId: desserts.id, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
      { name: 'Power Bowl', price: 11.99, shopId: greenBowl.id, categoryId: healthy.id, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
      { name: 'Avocado Toast', price: 8.99, shopId: greenBowl.id, categoryId: healthy.id, imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400' },
      { name: 'Fresh Lemonade', price: 2.99, shopId: greenBowl.id, categoryId: drinks.id, imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400' },
      { name: 'Double Cheese Burger', price: 13.99, shopId: burgerHub.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400' },
      { name: 'Mushroom Swiss Burger', price: 12.79, shopId: burgerHub.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400' },
      { name: 'Spicy Jalapeno Burger', price: 11.89, discountPercent: 12, shopId: burgerHub.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400' },
      { name: 'Chicken Nuggets', price: 6.49, shopId: burgerHub.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=400' },
      { name: 'Chocolate Milkshake', price: 4.99, shopId: burgerHub.id, categoryId: drinks.id, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
      { name: 'Vanilla Cola', price: 2.49, shopId: burgerHub.id, categoryId: drinks.id, imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400' },
      { name: 'Garlic Parmesan Fries', price: 5.99, shopId: burgerHub.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400' },
      { name: 'Four Cheese Pizza', price: 15.49, shopId: pizzaTown.id, categoryId: pizza.id, imageUrl: 'https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=400' },
      { name: 'BBQ Chicken Pizza', price: 16.99, discountPercent: 10, shopId: pizzaTown.id, categoryId: pizza.id, imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400' },
      { name: 'Veggie Pizza', price: 14.29, shopId: pizzaTown.id, categoryId: pizza.id, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
      { name: 'Calzone', price: 12.49, shopId: pizzaTown.id, categoryId: pizza.id, imageUrl: 'https://images.unsplash.com/photo-1600628422019-39ec86e6b0e6?w=400' },
      { name: 'Panna Cotta', price: 6.29, shopId: pizzaTown.id, categoryId: desserts.id, imageUrl: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400' },
      { name: 'Chocolate Brownie', price: 5.79, shopId: pizzaTown.id, categoryId: desserts.id, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400' },
      { name: 'Iced Peach Tea', price: 3.49, shopId: pizzaTown.id, categoryId: drinks.id, imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400' },
      { name: 'Caesar Salad Bowl', price: 10.49, shopId: greenBowl.id, categoryId: healthy.id, imageUrl: 'https://images.unsplash.com/photo-1512852939750-1305098529bf?w=400' },
      { name: 'Mediterranean Bowl', price: 12.29, shopId: greenBowl.id, categoryId: healthy.id, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
      { name: 'Grilled Salmon Bowl', price: 14.99, discountPercent: 8, shopId: greenBowl.id, categoryId: healthy.id, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
      { name: 'Berry Yogurt Parfait', price: 6.19, shopId: greenBowl.id, categoryId: desserts.id, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
      { name: 'Matcha Smoothie', price: 5.69, shopId: greenBowl.id, categoryId: drinks.id, imageUrl: 'https://images.unsplash.com/photo-1553531889-56cc480ac5cb?w=400' },
      { name: 'Mango Smoothie', price: 5.39, shopId: greenBowl.id, categoryId: drinks.id, imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400' },

      { name: 'Chicken Wok Noodles', price: 10.49, shopId: streetWok.id, categoryId: healthy.id, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400' },
      { name: 'Beef Teriyaki Bowl', price: 12.39, discountPercent: 10, shopId: streetWok.id, categoryId: healthy.id, imageUrl: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400' },
      { name: 'Crispy Spring Rolls', price: 6.19, shopId: streetWok.id, categoryId: desserts.id, imageUrl: 'https://images.unsplash.com/photo-1515668236457-83c3b8764839?w=400' },
      { name: 'Lychee Soda', price: 3.19, shopId: streetWok.id, categoryId: drinks.id, imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400' },
      { name: 'Pad Thai', price: 11.29, shopId: streetWok.id, categoryId: healthy.id, imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400' },

      { name: 'Classic Beef Taco', price: 4.99, shopId: tacoPoint.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400' },
      { name: 'Chicken Quesadilla', price: 8.29, shopId: tacoPoint.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400' },
      { name: 'Loaded Nachos', price: 7.59, shopId: tacoPoint.id, categoryId: desserts.id, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
      { name: 'Horchata', price: 3.49, shopId: tacoPoint.id, categoryId: drinks.id, imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400' },
      { name: 'Fish Taco', price: 5.49, discountPercent: 7, shopId: tacoPoint.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1611250188496-e966043a0629?w=400' },

      { name: 'Budget Burger', price: 5.49, shopId: budgetBites.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400' },
      { name: 'Mini Pizza Slice', price: 3.99, shopId: budgetBites.id, categoryId: pizza.id, imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400' },
      { name: 'Combo Cola', price: 1.79, shopId: budgetBites.id, categoryId: drinks.id, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' },
      { name: 'Choco Donut', price: 2.49, shopId: budgetBites.id, categoryId: desserts.id, imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400' },
      { name: 'Cheese Toastie', price: 4.29, shopId: budgetBites.id, categoryId: healthy.id, imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400' },

      { name: 'Midnight Hot Dog', price: 4.99, shopId: nightSnacks.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400' },
      { name: 'Loaded Fries Box', price: 5.89, shopId: nightSnacks.id, categoryId: burgers.id, imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400' },
      { name: 'Energy Drink', price: 2.99, shopId: nightSnacks.id, categoryId: drinks.id, imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400' },
      { name: 'Cookie Pack', price: 2.79, shopId: nightSnacks.id, categoryId: desserts.id, imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400' },
      { name: 'Ham Sandwich', price: 4.59, shopId: nightSnacks.id, categoryId: healthy.id, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' }
    ]
  });

  await prisma.coupon.createMany({
    data: [
      { name: 'Welcome', code: 'WELCOME10', discountPercent: 10, active: true, imageUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800' },
      { name: 'Spring', code: 'SPRING15', discountPercent: 15, active: true, imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800' },
      { name: 'VIP', code: 'VIP20', discountPercent: 20, active: true, imageUrl: 'https://images.unsplash.com/photo-1556742205-e10c9486e506?w=800' },
      { name: 'Weekend', code: 'WEEKEND12', discountPercent: 12, active: true, imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800' },
      { name: 'Taco Tuesday', code: 'TACO7', discountPercent: 7, active: true, imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800' },
      { name: 'Night Owl', code: 'NIGHT9', discountPercent: 9, active: true, imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800' },
      { name: 'Family Box', code: 'FAMILY18', discountPercent: 18, active: true, imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' },
      { name: 'Student', code: 'STUDENT5', discountPercent: 5, active: true, imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
