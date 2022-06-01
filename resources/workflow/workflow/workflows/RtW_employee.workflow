{
	"contents": {
		"0079aa4d-b823-4337-8d54-efa6ad447b13": {
			"classDefinition": "com.sap.bpm.wfs.Model",
			"id": "returnToWorkplaceEmployeeFlow",
			"subject": "returnToWorkplaceEmployeeFlow",
			"businessKey": "${context.userId}",
			"name": "returnToWorkplaceEmployeeFlow",
			"documentation": "",
			"lastIds": "62d7f4ed-4063-4c44-af8b-39050bd44926",
			"events": {
				"11a9b5ee-17c0-4159-9bbf-454dcfdcd5c3": {
					"name": "StartEvent"
				},
				"2798f4e7-bc42-4fad-a248-159095a2f40a": {
					"name": "EndEvent"
				},
				"5fa4c9db-9839-400e-a107-5937eff683b8": {
					"name": "receiveMessage"
				},
				"e5829ce6-c23f-4ab5-9e4c-10f8400a8fe5": {
					"name": "employeeFlowTimer"
				}
			},
			"activities": {
				"9e21bd8b-5516-495d-ad6d-c078caebe164": {
					"name": "shutdown"
				},
				"570db658-cda4-4e1a-8179-66363d775174": {
					"name": "processMessage"
				},
				"56a69099-5fcb-40c2-b3aa-479cd1bde440": {
					"name": "setPermission"
				},
				"7400da81-28c1-4275-b6bc-314f2faee907": {
					"name": "multipleProcessors"
				},
				"7f90e996-4c29-4799-8dfe-8d439a266968": {
					"name": "cleanup"
				}
			},
			"sequenceFlows": {
				"c6b99f32-5fe6-4ab6-b60a-80fba1b9ae0f": {
					"name": "SequenceFlow1"
				},
				"1ceb1d21-02d3-4692-b25b-8cf38e8e5819": {
					"name": "SequenceFlow2"
				},
				"cd4c4350-d51b-4261-83a0-e1cabd3617e3": {
					"name": "no"
				},
				"70e9a0d3-520f-4076-a5a3-a00f3b31a1c5": {
					"name": "SequenceFlow5"
				},
				"3546fe8a-def4-406c-9c96-3a943d34d2f0": {
					"name": "SequenceFlow9"
				},
				"e336d30d-060a-40ec-a45f-365a132ecd42": {
					"name": "SequenceFlow11"
				},
				"2ffff262-1835-4bb8-8127-5345c297872b": {
					"name": "SequenceFlow13"
				},
				"35de7993-4b91-4509-b5a0-ae05a9a5461f": {
					"name": "SequenceFlow14"
				},
				"94c65cba-cd16-4340-a84a-8ffb5c1b2af0": {
					"name": "yes"
				},
				"d74b7101-5a57-4503-aea8-8e798528e703": {
					"name": "SequenceFlow16"
				}
			},
			"diagrams": {
				"42fa7a2d-c526-4a02-b3ba-49b5168ba644": {}
			}
		},
		"11a9b5ee-17c0-4159-9bbf-454dcfdcd5c3": {
			"classDefinition": "com.sap.bpm.wfs.StartEvent",
			"id": "startevent1",
			"name": "StartEvent",
			"sampleContextRefs": {
				"8d39f1b8-7551-4a3d-8938-ee2ec3546ca9": {}
			}
		},
		"2798f4e7-bc42-4fad-a248-159095a2f40a": {
			"classDefinition": "com.sap.bpm.wfs.EndEvent",
			"id": "endevent1",
			"name": "EndEvent",
			"eventDefinitions": {
				"27c29c03-f689-4715-9d48-f3c59313dee4": {}
			}
		},
		"5fa4c9db-9839-400e-a107-5937eff683b8": {
			"classDefinition": "com.sap.bpm.wfs.IntermediateCatchEvent",
			"id": "intermediatemessageevent1",
			"name": "receiveMessage",
			"eventDefinitions": {
				"275fc5e0-3507-4ce8-9aa5-7babd69e2668": {}
			}
		},
		"e5829ce6-c23f-4ab5-9e4c-10f8400a8fe5": {
			"classDefinition": "com.sap.bpm.wfs.IntermediateCatchEvent",
			"id": "intermediatetimerevent1",
			"name": "employeeFlowTimer",
			"eventDefinitions": {
				"0d71e0a3-55c8-4e04-9213-72461dfe72c0": {}
			}
		},
		"9e21bd8b-5516-495d-ad6d-c078caebe164": {
			"classDefinition": "com.sap.bpm.wfs.ExclusiveGateway",
			"id": "exclusivegateway1",
			"name": "shutdown",
			"default": "cd4c4350-d51b-4261-83a0-e1cabd3617e3"
		},
		"570db658-cda4-4e1a-8179-66363d775174": {
			"classDefinition": "com.sap.bpm.wfs.ScriptTask",
			"reference": "/scripts/RtW_employee/processMessage.js",
			"id": "scripttask1",
			"name": "processMessage"
		},
		"56a69099-5fcb-40c2-b3aa-479cd1bde440": {
			"classDefinition": "com.sap.bpm.wfs.ScriptTask",
			"reference": "/scripts/RtW_employee/setPermission.js",
			"id": "scripttask2",
			"name": "setPermission"
		},
		"7400da81-28c1-4275-b6bc-314f2faee907": {
			"classDefinition": "com.sap.bpm.wfs.ParallelGateway",
			"id": "parallelgateway2",
			"name": "multipleProcessors"
		},
		"c6b99f32-5fe6-4ab6-b60a-80fba1b9ae0f": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow1",
			"name": "SequenceFlow1",
			"sourceRef": "11a9b5ee-17c0-4159-9bbf-454dcfdcd5c3",
			"targetRef": "56a69099-5fcb-40c2-b3aa-479cd1bde440"
		},
		"1ceb1d21-02d3-4692-b25b-8cf38e8e5819": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow2",
			"name": "SequenceFlow2",
			"sourceRef": "5fa4c9db-9839-400e-a107-5937eff683b8",
			"targetRef": "570db658-cda4-4e1a-8179-66363d775174"
		},
		"cd4c4350-d51b-4261-83a0-e1cabd3617e3": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow4",
			"name": "no",
			"sourceRef": "9e21bd8b-5516-495d-ad6d-c078caebe164",
			"targetRef": "5fa4c9db-9839-400e-a107-5937eff683b8"
		},
		"70e9a0d3-520f-4076-a5a3-a00f3b31a1c5": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow5",
			"name": "SequenceFlow5",
			"sourceRef": "570db658-cda4-4e1a-8179-66363d775174",
			"targetRef": "9e21bd8b-5516-495d-ad6d-c078caebe164"
		},
		"3546fe8a-def4-406c-9c96-3a943d34d2f0": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow9",
			"name": "SequenceFlow9",
			"sourceRef": "e5829ce6-c23f-4ab5-9e4c-10f8400a8fe5",
			"targetRef": "2798f4e7-bc42-4fad-a248-159095a2f40a"
		},
		"e336d30d-060a-40ec-a45f-365a132ecd42": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow11",
			"name": "SequenceFlow11",
			"sourceRef": "56a69099-5fcb-40c2-b3aa-479cd1bde440",
			"targetRef": "7400da81-28c1-4275-b6bc-314f2faee907"
		},
		"2ffff262-1835-4bb8-8127-5345c297872b": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow13",
			"name": "SequenceFlow13",
			"sourceRef": "7400da81-28c1-4275-b6bc-314f2faee907",
			"targetRef": "5fa4c9db-9839-400e-a107-5937eff683b8"
		},
		"35de7993-4b91-4509-b5a0-ae05a9a5461f": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow14",
			"name": "SequenceFlow14",
			"sourceRef": "7400da81-28c1-4275-b6bc-314f2faee907",
			"targetRef": "e5829ce6-c23f-4ab5-9e4c-10f8400a8fe5"
		},
		"42fa7a2d-c526-4a02-b3ba-49b5168ba644": {
			"classDefinition": "com.sap.bpm.wfs.ui.Diagram",
			"symbols": {
				"df898b52-91e1-4778-baad-2ad9a261d30e": {},
				"53e54950-7757-4161-82c9-afa7e86cff2c": {},
				"6bb141da-d485-4317-93b8-e17711df4c32": {},
				"36233092-cce7-42e1-bd5b-dff94649a559": {},
				"f499d69d-1f48-4c1d-89f7-5d6a8e7bab6b": {},
				"66df053b-0717-400b-8b90-bfda1e9cbd86": {},
				"eb9af816-2b65-494b-a496-385d73e8c4e7": {},
				"ff1ce744-8147-446f-9b0a-907119a1733f": {},
				"13068cf6-8401-4a06-8a8e-83f9d613b2aa": {},
				"a4263391-202e-4f06-9579-0a7de4db4042": {},
				"59de2ff1-93d3-4e45-a487-d0eeb42ae3a0": {},
				"368e70be-6cdd-4a09-824a-6d49b2415ef5": {},
				"10b33458-2c5a-40e9-a537-7ee30b48f8a0": {},
				"bbb39707-bbd7-4a4f-8f71-56ca9576e3b3": {},
				"942a520e-d4a4-4500-a2eb-dadc49e42318": {},
				"5a6706e3-7653-4422-9eff-3cae7e1de12b": {},
				"b24f3177-97e1-4be3-9039-65ad2f617344": {},
				"39192177-0125-4f4f-bb68-05bc630c8331": {},
				"1e268cb5-6e82-431b-8c75-2aec95dd8eb8": {}
			}
		},
		"8d39f1b8-7551-4a3d-8938-ee2ec3546ca9": {
			"classDefinition": "com.sap.bpm.wfs.SampleContext",
			"reference": "/sample-data/RtW_employee/initContext.json",
			"id": "default-start-context"
		},
		"27c29c03-f689-4715-9d48-f3c59313dee4": {
			"classDefinition": "com.sap.bpm.wfs.TerminateEventDefinition",
			"id": "terminateeventdefinition2"
		},
		"275fc5e0-3507-4ce8-9aa5-7babd69e2668": {
			"classDefinition": "com.sap.bpm.wfs.MessageEventDefinition",
			"responseVariable": "${context.msgPayload}",
			"id": "messageeventdefinition1",
			"messageRef": "9da7b33e-71f4-4cf5-8757-25a50f90176a"
		},
		"0d71e0a3-55c8-4e04-9213-72461dfe72c0": {
			"classDefinition": "com.sap.bpm.wfs.TimerEventDefinition",
			"timeDuration": "P2Y",
			"id": "timereventdefinition1"
		},
		"df898b52-91e1-4778-baad-2ad9a261d30e": {
			"classDefinition": "com.sap.bpm.wfs.ui.StartEventSymbol",
			"x": -238,
			"y": 100,
			"width": 32,
			"height": 32,
			"object": "11a9b5ee-17c0-4159-9bbf-454dcfdcd5c3"
		},
		"53e54950-7757-4161-82c9-afa7e86cff2c": {
			"classDefinition": "com.sap.bpm.wfs.ui.EndEventSymbol",
			"x": 732,
			"y": 100,
			"width": 35,
			"height": 35,
			"object": "2798f4e7-bc42-4fad-a248-159095a2f40a"
		},
		"6bb141da-d485-4317-93b8-e17711df4c32": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "-222,116.21875 -65.31752868885724,116.21875",
			"sourceSymbol": "df898b52-91e1-4778-baad-2ad9a261d30e",
			"targetSymbol": "368e70be-6cdd-4a09-824a-6d49b2415ef5",
			"object": "c6b99f32-5fe6-4ab6-b60a-80fba1b9ae0f"
		},
		"36233092-cce7-42e1-bd5b-dff94649a559": {
			"classDefinition": "com.sap.bpm.wfs.ui.IntermediateCatchEventSymbol",
			"x": 168.24147286593848,
			"y": 99.75,
			"width": 32,
			"height": 32,
			"object": "5fa4c9db-9839-400e-a107-5937eff683b8"
		},
		"f499d69d-1f48-4c1d-89f7-5d6a8e7bab6b": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "184.24147286593848,116.09375 329.9226171997954,116.09375",
			"sourceSymbol": "36233092-cce7-42e1-bd5b-dff94649a559",
			"targetSymbol": "ff1ce744-8147-446f-9b0a-907119a1733f",
			"object": "1ceb1d21-02d3-4692-b25b-8cf38e8e5819"
		},
		"66df053b-0717-400b-8b90-bfda1e9cbd86": {
			"classDefinition": "com.sap.bpm.wfs.ui.ExclusiveGatewaySymbol",
			"x": 444.61853886551285,
			"y": 96.125,
			"object": "9e21bd8b-5516-495d-ad6d-c078caebe164"
		},
		"eb9af816-2b65-494b-a496-385d73e8c4e7": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "465.61853886551285,96.625 465.6185302734375,46.125 184.241455078125,46.125 184.24147286593848,100.25",
			"sourceSymbol": "66df053b-0717-400b-8b90-bfda1e9cbd86",
			"targetSymbol": "36233092-cce7-42e1-bd5b-dff94649a559",
			"object": "cd4c4350-d51b-4261-83a0-e1cabd3617e3"
		},
		"ff1ce744-8147-446f-9b0a-907119a1733f": {
			"classDefinition": "com.sap.bpm.wfs.ui.ScriptTaskSymbol",
			"x": 279.9226171997954,
			"y": 86.4375,
			"width": 100,
			"height": 60,
			"object": "570db658-cda4-4e1a-8179-66363d775174"
		},
		"13068cf6-8401-4a06-8a8e-83f9d613b2aa": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "329.9226171997954,116.78125 465.61853886551285,116.78125",
			"sourceSymbol": "ff1ce744-8147-446f-9b0a-907119a1733f",
			"targetSymbol": "66df053b-0717-400b-8b90-bfda1e9cbd86",
			"object": "70e9a0d3-520f-4076-a5a3-a00f3b31a1c5"
		},
		"a4263391-202e-4f06-9579-0a7de4db4042": {
			"classDefinition": "com.sap.bpm.wfs.ui.IntermediateCatchEventSymbol",
			"x": 314.0561693841076,
			"y": 248.8125,
			"width": 32,
			"height": 32,
			"object": "e5829ce6-c23f-4ab5-9e4c-10f8400a8fe5"
		},
		"59de2ff1-93d3-4e45-a487-d0eeb42ae3a0": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "330.0561693841076,264.8125 749.5,264.8125 749.5,134.5",
			"sourceSymbol": "a4263391-202e-4f06-9579-0a7de4db4042",
			"targetSymbol": "53e54950-7757-4161-82c9-afa7e86cff2c",
			"object": "3546fe8a-def4-406c-9c96-3a943d34d2f0"
		},
		"368e70be-6cdd-4a09-824a-6d49b2415ef5": {
			"classDefinition": "com.sap.bpm.wfs.ui.ScriptTaskSymbol",
			"x": -115.31752868885724,
			"y": 86.4375,
			"width": 100,
			"height": 60,
			"object": "56a69099-5fcb-40c2-b3aa-479cd1bde440"
		},
		"10b33458-2c5a-40e9-a537-7ee30b48f8a0": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "-65.31752868885724,116.765625 59.71381861512094,116.765625",
			"sourceSymbol": "368e70be-6cdd-4a09-824a-6d49b2415ef5",
			"targetSymbol": "bbb39707-bbd7-4a4f-8f71-56ca9576e3b3",
			"object": "e336d30d-060a-40ec-a45f-365a132ecd42"
		},
		"bbb39707-bbd7-4a4f-8f71-56ca9576e3b3": {
			"classDefinition": "com.sap.bpm.wfs.ui.ParallelGatewaySymbol",
			"x": 38.71381861512094,
			"y": 96.09375,
			"object": "7400da81-28c1-4275-b6bc-314f2faee907"
		},
		"942a520e-d4a4-4500-a2eb-dadc49e42318": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "59.71381861512094,116.421875 184.24147286593848,116.421875",
			"sourceSymbol": "bbb39707-bbd7-4a4f-8f71-56ca9576e3b3",
			"targetSymbol": "36233092-cce7-42e1-bd5b-dff94649a559",
			"object": "2ffff262-1835-4bb8-8127-5345c297872b"
		},
		"5a6706e3-7653-4422-9eff-3cae7e1de12b": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "59.71381861512094,137.59375 59.71381759643555,264.8125 314.5561693841076,264.8125",
			"sourceSymbol": "bbb39707-bbd7-4a4f-8f71-56ca9576e3b3",
			"targetSymbol": "a4263391-202e-4f06-9579-0a7de4db4042",
			"object": "35de7993-4b91-4509-b5a0-ae05a9a5461f"
		},
		"62d7f4ed-4063-4c44-af8b-39050bd44926": {
			"classDefinition": "com.sap.bpm.wfs.LastIDs",
			"terminateeventdefinition": 2,
			"messageeventdefinition": 1,
			"message": 4,
			"timereventdefinition": 2,
			"sequenceflow": 16,
			"startevent": 1,
			"intermediatemessageevent": 1,
			"intermediatetimerevent": 2,
			"endevent": 1,
			"scripttask": 3,
			"exclusivegateway": 1,
			"parallelgateway": 2,
			"referencedsubflow": 1
		},
		"42efa920-6fd6-4eb3-88bb-eec4c6ed5469": {
			"classDefinition": "com.sap.bpm.wfs.Message",
			"name": "tempCache",
			"id": "message2"
		},
		"9da7b33e-71f4-4cf5-8757-25a50f90176a": {
			"classDefinition": "com.sap.bpm.wfs.Message",
			"name": "msgPayload",
			"id": "message4"
		},
		"7f90e996-4c29-4799-8dfe-8d439a266968": {
			"classDefinition": "com.sap.bpm.wfs.ScriptTask",
			"reference": "/scripts/RtW_employee/cleanup.js",
			"id": "scripttask3",
			"name": "cleanup"
		},
		"b24f3177-97e1-4be3-9039-65ad2f617344": {
			"classDefinition": "com.sap.bpm.wfs.ui.ScriptTaskSymbol",
			"x": 562.6185388655128,
			"y": 86.125,
			"width": 100,
			"height": 60,
			"object": "7f90e996-4c29-4799-8dfe-8d439a266968"
		},
		"94c65cba-cd16-4340-a84a-8ffb5c1b2af0": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"condition": "${context.shutdown==true}",
			"id": "sequenceflow15",
			"name": "yes",
			"sourceRef": "9e21bd8b-5516-495d-ad6d-c078caebe164",
			"targetRef": "7f90e996-4c29-4799-8dfe-8d439a266968"
		},
		"39192177-0125-4f4f-bb68-05bc630c8331": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "465.61853886551285,116.625 612.6185388655128,116.625",
			"sourceSymbol": "66df053b-0717-400b-8b90-bfda1e9cbd86",
			"targetSymbol": "b24f3177-97e1-4be3-9039-65ad2f617344",
			"object": "94c65cba-cd16-4340-a84a-8ffb5c1b2af0"
		},
		"d74b7101-5a57-4503-aea8-8e798528e703": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow16",
			"name": "SequenceFlow16",
			"sourceRef": "7f90e996-4c29-4799-8dfe-8d439a266968",
			"targetRef": "2798f4e7-bc42-4fad-a248-159095a2f40a"
		},
		"1e268cb5-6e82-431b-8c75-2aec95dd8eb8": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "612.6185388655128,116.8125 732.5,116.8125",
			"sourceSymbol": "b24f3177-97e1-4be3-9039-65ad2f617344",
			"targetSymbol": "53e54950-7757-4161-82c9-afa7e86cff2c",
			"object": "d74b7101-5a57-4503-aea8-8e798528e703"
		}
	}
}