import { Image, Text, View, TouchableOpacity } from "react-native";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

import { PRODUCTS } from "@/utils/data/products";
import { useCartStore } from "@/stores/cart-store";

import { Button } from "@/components/button";
import { formatCurrency } from "@/utils/functions/formatCurrency";
import { LinkButton } from "@/components/link-button";
import colors from "tailwindcss/colors";

export default function Product() {
  const cartStore = useCartStore();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const product = PRODUCTS.find((product) => product.id === id);
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {
    if (product) {
      cartStore.add({ ...product, quantity });
      navigation.goBack();
    }
  }

  function handleIncrement() {
    setQuantity((prev) => prev + 1);
  }

  function handleDecrement() {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }

  if (!product) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1">
      <Image
        source={product.cover}
        className="w-full h-52"
        resizeMode="cover"
      />

      <View className="p-5 mt-8 flex-1">
        <Text className="text-white text-xl font-heading">{product.title}</Text>

        <Text className="text-lime-400 text-2xl font-heading my-2">
          {formatCurrency(product.price)}
        </Text>

        <Text className="text-slate-400 font-body text-base leading-6 mb-6">
          {product.description}
        </Text>

        {product.ingredients.map((ingredient) => (
          <Text
            className="text-slate-400 font-body text-base leading-6"
            key={ingredient}
          >
            {"\u2022"} {ingredient}
          </Text>
        ))}
      </View>

      <View className="p-5 gap-3">
        <View className="flex-row items-center justify-evenly mb-4">
          <TouchableOpacity onPress={handleDecrement}>
            <Feather name="minus-circle" size={30} color={colors.lime[500]} />
          </TouchableOpacity>
          <Text className="text-white text-lg mx-4">{quantity}</Text>
          <TouchableOpacity onPress={handleIncrement}>
            <Feather name="plus-circle" size={30} color={colors.lime[500]} />
          </TouchableOpacity>
        </View>
        <Button onPress={handleAddToCart}>
          <Button.Icon>
            <Feather name="shopping-cart" size={20} />
          </Button.Icon>
          <Button.Text>Adicionar {quantity} ao pedido</Button.Text>
        </Button>
        <LinkButton title="Voltar ao cardápio" href={"/"} />
      </View>
    </View>
  );
}
