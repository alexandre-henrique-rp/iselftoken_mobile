import { StyleSheet, Text, TextStyle } from "react-native";
import { Colors } from '@/constants';

type LogoProps = {
  style?: TextStyle;
};


export const Logo = ({ style }: LogoProps) => {
  return (
      <Text style={[css.logo, style]}>ISelfToken</Text>
  );
};

const css = StyleSheet.create({
  logo: {
    fontSize: 48, // Aumentado de 24 para 48
    fontWeight: 'bold',
    fontFamily: 'Inter_600SemiBold',
    color: Colors.primary, // MAGENTA do tema
  },
});
