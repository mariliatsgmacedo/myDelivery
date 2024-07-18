import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { LinkButton } from "@/components/link-button";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/formatCurrency";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LottieView from "lottie-react-native";

export default function Cart() {
  const [address, setAddress] = useState("");
  const navigation = useNavigation();
  const cartStore = useCartStore();
  const total = formatCurrency(
    cartStore.products.reduce(
      (totalacc, prod) => totalacc + prod.price * prod.quantity,
      0
    )
  );
  const PHONE_NUMBER = 15012345789;

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Remover", `Deseja remover ${product.title}?`, [
      {
        text: "Cancelar",
      },
      {
        text: "Remover",
        onPress: () => cartStore.remove(product.id),
      },
    ]);
  }

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert("Informe os dados da entrega");
    }
    const products = cartStore.products
      .map((prod) => `\n ${prod.quantity} ${prod.title}`)
      .join("");

    const message = `
    NOVO PEDIDO \n 
    Entregar em: ${address} ${products} \n 
    Valor total: ${total}`;

    Linking.openURL(
      `http://api.whatsapp.com/send?phone${PHONE_NUMBER}&text=${message}`
    );
    cartStore.clear();
    navigation.goBack();
  }

  return (
    <View className="flex-1 p-5">
      <Header title="Seu carrinho" />
      <View>
        <View className="flex-row items-center justify-between border-b border-slate-700 mx-5">
          <LottieView
            source={require("../../assets/images/coin.json")}
            autoPlay
            loop
            style={{ width: 70, height: 70 }}
          />
          <View className="flex-row gap-2 items-center">
            <Text className="text-white text-xl font-subtitle">Total: </Text>
            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
          </View>
        </View>
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        // extraHeight={100}
      >
        <ScrollView>
          <View className="flex-1 p-5">
            {cartStore.products.length > 0 ? (
              <View className=" pt-5 border-b border-slate-700">
                {cartStore.products.map((prod) => (
                  <Product
                    key={prod.id}
                    data={prod}
                    onPress={() => handleProductRemove(prod)}
                  />
                ))}
                <Input
                  onChangeText={setAddress}
                  // blurOnSubmit={true}
                  // onSubmitEditing={handleOrder}
                  // returnKeyType="next"
                  placeholder="Informe o endereço de entrega com rua, bairro, cep"
                  className="my-5"
                />
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu carrinho está vazio
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>
        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  );
}
