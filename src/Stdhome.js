import React, { useCallback, memo, useRef, useState } from "react";
import {
  FlatList,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
} from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  slide: {
    height: windowHeight,
    width: windowWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  slideImage: { width: windowWidth * 0.9, height: windowHeight * 0.9 },
   

  pagination: {
    position: "absolute",
    bottom: 8,
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  paginationDotActive: { backgroundColor: "lightblue" },
  paginationDotInactive: { backgroundColor: "gray" },

  carousel: { flex: 1 },
});

var list=[
    "data:image/png;base64,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"
    ,"data:image/jpeg;base64,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"
    ,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMMZ-jT2LHRegENRNIydMzW5nbST_PCXaUNQ&usqp=CAU"
,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAHq0poEYnb-actri2rKBCDUIqs9E76RCS0A&usqp=CAU"
,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMEis0OzjfR-Elo9afMT-jCBATysg2FAtnEw&usqp=CAU"
]

const slideList = Array.from({ length: 5 }).map((_, i) => {
  return {
    id: i,
    image: `${list[i]}`, 
  };
});

const Slide = memo(function Slide({ data }) {
  return (
    <View style={styles.slide}>
      <Image source={{ uri: data.image }} style={styles.slideImage}></Image> 
    </View>
  );
});

function Pagination({ index }) {
  return (
    <View style={styles.pagination} pointerEvents="none">
      {slideList.map((_, i) => {
        return (
          <View
            key={i}
            style={[
              styles.paginationDot,
              index === i
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        );
      })}
    </View>
  );
}

export default function Stdhome() {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  indexRef.current = index;
  const onScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    // Prevent one pixel triggering setIndex in the middle
    // of the transition. With this we have to scroll a bit
    // more to trigger the index change.
    const isNoMansLand = 0.4 < distance;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);

  const flatListOptimizationProps = {
    initialNumToRender: 0,
    maxToRenderPerBatch: 1,
    removeClippedSubviews: true,
    scrollEventThrottle: 16,
    windowSize: 2,
    keyExtractor: useCallback(s => String(s.id), []),
    getItemLayout: useCallback(
      (_, index) => ({
        index,
        length: windowWidth,
        offset: index * windowWidth,
      }),
      []
    ),
  };

  const renderItem = useCallback(function renderItem({ item }) {
    return <Slide data={item} />;
  }, []);

  return (
    <>
      <FlatList
        data={slideList}
        style={styles.carousel}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        {...flatListOptimizationProps}
      />
      <Pagination index={index}></Pagination>
    </>
  );
}