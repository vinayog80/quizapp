import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, Animated, Modal, SafeAreaView } from 'react-native';
import { QuizDb, THEME } from '../constants/index';

const { width } = Dimensions.get('window');

const QuizItemContainer = ({ quizItem, currentIndex, selectedOption }) => {
    return (
        <View style={{ width: width, flexDirection: "column", }}>
            <View style={{ alignSelf: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: "#000" }}>{currentIndex}. {quizItem.question}</Text>
            </View>
            <View>
                <FlatList
                    pagingEnabled
                    data={quizItem.Options}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={{
                                width: '90%',
                                height: 50,
                                backgroundColor: quizItem.marked == index + 1 ? THEME.primary : THEME.whiteSmoke,
                                borderWidth: 1,
                                marginVertical: 10,
                                flexDirection: 'row',
                                borderRadius: 6,
                                alignSelf: "center",
                                paddingLeft: 10,
                            }}
                            activeOpacity={.8}
                            onPress={() => {
                                selectedOption(index + 1)
                            }}
                        >
                            <View
                                style={{
                                    width: 30, height: 30,
                                    backgroundColor: quizItem.marked == index + 1 ? THEME.secondary : THEME.primary,
                                    alignItems: 'center',
                                    justifyContent: "center",
                                    borderRadius: 50,
                                    marginTop: 7,
                                    marginRight: 10
                                }}>
                                <Text style={{ color: THEME.whiteSmoke, fontWeight: '600' }}>{index == 0 ? 'A' : index == 1 ? 'B' : index == 2 ? 'C' : 'D'}</Text>
                            </View>
                            <Text style={{ color: quizItem.marked == index + 1 ? THEME.whiteSmoke : "#000", fontSize: 16, fontWeight: '600', marginTop: 11 }}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
}

export const QuizScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [questions, setQuestions] = useState(QuizDb);
    const listRef = useRef();
    const [quizModal, setQuizModal] = useState(false);

    let quizlength = 0;
    for (let index = 0; index <= questions.length - 1; index++) {
        if (questions[index]) quizlength = quizlength += 1;
    }

    const OnSelectOption = (index, x) => {
        var currQuestion = questions;
        currQuestion.map((item, idx) => {
            if (index == idx) {
                if (item.marked !== -1) {
                    item.marked = -1;
                } else {
                    item.marked = x;
                }
            }
        })
        let temp = [];
        currQuestion.map((item) => {
            temp.push(item);
        })
        setQuestions(temp);
    }

    const getTextScore = () => {
        let countMarks = 0;
        questions.map((item) => {
            if (item.marked != -1) {
                countMarks = countMarks += 5;
            }
        })
        return countMarks;
    }

    const reset = () => {
        const tempData = questions;
        tempData.map((item, ind) => {
            item.marked = -1;
        });
        let temp = [];
        tempData.map(item => {
            temp.push(item);
        });
        setQuestions(temp);
    };

    return (
        <SafeAreaView style={{ width: width, height: '100%' }}>
            <View style={{ flexDirection: "row", width: '100%', marginTop: 40 }}>
                <View style={{ width: '85%', paddingLeft: 20 }}><Text style={{ fontSize: 18, color: "#000", fontWeight: "700" }}>English Quiz:</Text></View>
                <View style={{ width: '15%' }}><Text style={{ fontSize: 16, color: "#000", fontWeight: '600' }}>{currentIndex + `/` + quizlength}</Text></View>
            </View>
            <View style={{ paddingLeft: 20, marginTop: 10 }}>
                <Text
                    style={{
                        marginRight: 20,
                        fontSize: 20,
                        fontWeight: '600',
                        color: 'black',
                    }}
                    onPress={() => {
                        reset();
                        listRef.current.scrollToIndex({ animated: true, index: 0 });
                    }}>
                    Reset
                </Text>
            </View>
            <View style={{ marginTop: 30 }}>
                <FlatList
                    ref={listRef}
                    pagingEnabled={true}
                    onScroll={(e) => {
                        let x = e.nativeEvent.contentOffset.x / width;
                        setCurrentIndex((x + 1).toFixed(0));
                    }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={questions}
                    renderItem={({ item, index }) => (
                        <QuizItemContainer
                            quizItem={item}
                            currentIndex={currentIndex}
                            selectedOption={x => {
                                OnSelectOption(index, x);
                            }}
                        />
                    )}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        position: 'absolute',
                        bottom: -80,
                        paddingHorizontal: 20
                    }}>
                    {
                        currentIndex > 1 ? (<TouchableOpacity
                            disabled={currentIndex == 1 ? true : false}
                            onPress={() => {
                                if (currentIndex > 1) {
                                    listRef.current.scrollToIndex({
                                        animated: true,
                                        index: parseInt(currentIndex) - 2,
                                    });
                                }
                            }}
                            style={{
                                width: '30%',
                                height: 40,
                                backgroundColor: currentIndex == 1 ? THEME.secondary : THEME.primary,
                                borderRadius: 6,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <Text style={{ color: "#fff", fontSize: 16, fontWeight: '600' }}>{'PREVIOUS'}</Text>
                        </TouchableOpacity>) : (<View />)
                    }

                    {currentIndex == 8 ?
                        (<TouchableOpacity
                            onPress={() => {
                                setQuizModal(!quizModal);
                            }}
                            style={{
                                backgroundColor: 'green',
                                height: 50,
                                width: 100,
                                borderRadius: 10,
                                marginRight: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text style={{ color: '#fff' }}>Submit</Text>
                        </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                disabled={questions[currentIndex - 1].marked != -1 ? false : true}
                                onPress={() => {
                                    if (questions[currentIndex - 1].marked != -1) {
                                        if (currentIndex < quizlength) {
                                            listRef.current.scrollToIndex({
                                                animated: true,
                                                index: currentIndex,
                                            });
                                        }
                                    }
                                }}
                                style={{
                                    width: '30%',
                                    height: 40,
                                    backgroundColor: questions[currentIndex - 1].marked == -1 ? THEME.secondary : THEME.primary,
                                    borderRadius: 6,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                <Text style={{ color: "#fff", fontSize: 16, fontWeight: '600' }}>{'NEXT'}</Text>
                            </TouchableOpacity>)}
                </View>
            </View>


            <Modal
                animationType="slide"
                transparent={true}
                visible={quizModal}
                onRequestClose={() => {
                    setQuizModal(!quizModal)
                }}
            >
                <Animated.View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            width: '90%',

                            borderRadius: 10,
                        }}>
                        <Text
                            style={{
                                fontSize: 30,
                                fontWeight: '800',
                                alignSelf: 'center',
                                marginTop: 20,
                            }}>
                            Test Score
                        </Text>
                        <Text
                            style={{
                                fontSize: 40,
                                fontWeight: '800',
                                alignSelf: 'center',
                                marginTop: 20,
                                color: 'green',
                            }}>
                            {getTextScore()}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setQuizModal(!quizModal)
                            }}
                            style={{
                                alignSelf: 'center',
                                height: 40,
                                padding: 10,
                                borderWidth: 1,
                                borderRadius: 10,
                                marginTop: 20,
                                marginBottom: 20,
                            }}
                        >
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Modal>

        </SafeAreaView>
    )
}

